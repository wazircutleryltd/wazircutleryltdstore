"use client";

import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";
import { Star, TrendingUp, Award, Power } from "lucide-react";

interface ProductSettingsProps {
  formData: {
    isActive: boolean;
    isFeatured: boolean;
    isTrending: boolean;
    isBestSelling: boolean;
    [key: string]: any;
  };
  handleInputChange: (field: string, value: boolean) => void;
}

export default function ProductSettings({ formData, handleInputChange }: ProductSettingsProps) {
  const settings = [
    {
      id: "isActive",
      label: "Market Visibility",
      description: "Controls if the product is live for public viewing and purchase.",
      icon: Power,
      activeColor: "peer-data-[state=checked]:bg-emerald-500"
    },
    {
      id: "isFeatured",
      label: "Elevated Spotlight",
      description: "Priority placement in the 'Featured Artisan' collections.",
      icon: Star,
      activeColor: "peer-data-[state=checked]:bg-amber-500"
    },
    {
      id: "isTrending",
      label: "Trending Velocity",
      description: "Tag as 'Popular' to drive FOMO and higher conversion rates.",
      icon: TrendingUp,
      activeColor: "peer-data-[state=checked]:bg-blue-500"
    },
    {
      id: "isBestSelling",
      label: "Hall of Fame",
      description: "Verified top-performer status for the Best-Selling galley.",
      icon: Award,
      activeColor: "peer-data-[state=checked]:bg-indigo-500"
    }
  ];

  return (
    <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6 divide-y divide-gray-100 shadow-inner">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 font-geist mb-4">Strategic Positioning</h4>
      <div className="space-y-6 pt-2">
        {settings.map((item) => (
          <div key={item.id} className="flex items-center justify-between group py-1">
            <div className="flex gap-4 items-start">
              <div className="mt-1 p-2 bg-white rounded-xl border border-gray-100 shadow-sm transition-transform group-hover:scale-110">
                <item.icon className="h-4 w-4 text-gray-500" />
              </div>
              <div className="space-y-0.5">
                <Label htmlFor={item.id} className="text-sm font-bold text-[#2C2C2C] cursor-pointer">
                  {item.label}
                </Label>
                <p className="text-[11px] text-gray-400 font-medium leading-tight max-w-[200px]">
                  {item.description}
                </p>
              </div>
            </div>
            <Switch
              id={item.id}
              checked={Boolean(formData[item.id])}
              onCheckedChange={(checked) => handleInputChange(item.id, checked)}
              className={item.activeColor}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
