import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterSidebarProps {
  categories: any[];
  materials: string[];
  priceRange: { min: number; max: number };
  selectedCategory?: number;
  selectedMaterials: string[];
  selectedPriceRange: [number, number];
  onCategoryChange: (categoryId: number | undefined) => void;
  onMaterialChange: (material: string, checked: boolean) => void;
  onPriceChange: (range: [number, number]) => void;
  onReset: () => void;
}

export function FilterSidebar({
  categories,
  materials,
  priceRange,
  selectedCategory,
  selectedMaterials,
  selectedPriceRange,
  onCategoryChange,
  onMaterialChange,
  onPriceChange,
  onReset,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    material: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const hasActiveFilters = selectedCategory || selectedMaterials.length > 0 || 
    selectedPriceRange[0] > priceRange.min || selectedPriceRange[1] < priceRange.max;

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <Card>
        <CardHeader
          className="cursor-pointer flex flex-row items-center justify-between space-y-0 pb-3"
          onClick={() => toggleSection('category')}
        >
          <CardTitle className="text-sm font-semibold">Category</CardTitle>
          {expandedSections.category ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </CardHeader>
        {expandedSections.category && (
          <CardContent className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={!selectedCategory}
                onCheckedChange={() => onCategoryChange(undefined)}
              />
              <span className="text-sm text-gray-700">All Categories</span>
            </label>
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectedCategory === cat.id}
                  onCheckedChange={() => onCategoryChange(cat.id)}
                />
                <span className="text-sm text-gray-700">{cat.name}</span>
              </label>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Price Filter */}
      <Card>
        <CardHeader
          className="cursor-pointer flex flex-row items-center justify-between space-y-0 pb-3"
          onClick={() => toggleSection('price')}
        >
          <CardTitle className="text-sm font-semibold">Price Range</CardTitle>
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </CardHeader>
        {expandedSections.price && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Slider
                value={selectedPriceRange}
                onValueChange={(value) => onPriceChange(value as [number, number])}
                min={priceRange.min}
                max={priceRange.max}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>₹{selectedPriceRange[0].toLocaleString()}</span>
                <span>₹{selectedPriceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Material Filter */}
      {materials.length > 0 && (
        <Card>
          <CardHeader
            className="cursor-pointer flex flex-row items-center justify-between space-y-0 pb-3"
            onClick={() => toggleSection('material')}
          >
            <CardTitle className="text-sm font-semibold">Material</CardTitle>
            {expandedSections.material ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </CardHeader>
          {expandedSections.material && (
            <CardContent className="space-y-2">
              {materials.map((material) => (
                <label key={material} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={selectedMaterials.includes(material)}
                    onCheckedChange={(checked) => onMaterialChange(material, !!checked)}
                  />
                  <span className="text-sm text-gray-700">{material}</span>
                </label>
              ))}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
