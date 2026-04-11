# 📈 Dashboard Performance Optimization (RPC)

Run the following SQL script in your **Supabase SQL Editor** to enable high-performance server-side aggregation for your admin dashboard. This replaces slow client-side calculations with instant database-level summaries.

```sql
-- High-performance dashboard summary function
CREATE OR REPLACE FUNCTION get_dashboard_summary()
RETURNS JSON AS $$
DECLARE
    total_revenue DECIMAL;
    products_count INTEGER;
    orders_count INTEGER;
    customers_count INTEGER;
    revenue_history JSON;
BEGIN
    -- 1. Calculate total revenue (excluding cancelled orders)
    SELECT COALESCE(SUM(total), 0) INTO total_revenue 
    FROM orders 
    WHERE status != 'cancelled';

    -- 2. Fetch counts for core entities
    SELECT COUNT(*) INTO products_count FROM products;
    SELECT COUNT(*) INTO orders_count FROM orders;
    SELECT COUNT(*) INTO customers_count FROM users;

    -- 3. Aggregate last 6 months of revenue history for the chart
    SELECT json_agg(t) INTO revenue_history
    FROM (
        SELECT 
            to_char(month_date, 'Mon') as name,
            extract(year from month_date) as year,
            (extract(month from month_date) - 1)::integer as "monthNum",
            COALESCE(SUM(o.total), 0)::float as total
        FROM (
            SELECT date_trunc('month', current_date) - (n || ' months')::interval as month_date
            FROM generate_series(0, 5) n
        ) months
        LEFT JOIN orders o ON date_trunc('month', o.created_at) = months.month_date AND o.status != 'cancelled'
        GROUP BY month_date
        ORDER BY month_date ASC
    ) t;

    -- 4. Return consolidated JSON object
    RETURN json_build_object(
        'totalRevenue', total_revenue,
        'productsCount', products_count,
        'ordersCount', orders_count,
        'customersCount', customers_count,
        'revenueHistory', revenue_history
    );
END;
$$ LANGUAGE plpgsql;
```

### Next Steps:
1.  Run the code above in Supabase.
2.  Enable access to this function by ensuring a policy or simply running it as a standard RPC (default functions are accessible to the `anon` and `authenticated` roles if public).
