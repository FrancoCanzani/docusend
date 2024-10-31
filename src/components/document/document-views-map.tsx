'use client';

import React, { useMemo, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from 'react-simple-maps';
import { geoMap } from '@/lib/constants/geo-map';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Plus, Minus, Maximize2 } from 'lucide-react';
import { DocumentView } from '@/app/(dashboard)/document/[documentId]/columns';
import getCountryData from '@/lib/helpers/get-country-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CountryData {
  count: number;
  countryCode: string;
  name: string;
  region: string;
  flag: string;
  cities: {
    name: string;
    count: number;
    coordinates: [number, number];
  }[];
}

type DocumentViewsMapProps = {
  documentViews: DocumentView[];
};

export default function DocumentViewsMap({
  documentViews,
}: DocumentViewsMapProps) {
  const [tooltipContent, setTooltipContent] = useState('');
  const [position, setPosition] = useState({ coordinates: [0, 30], zoom: 1 });
  const [showCities, setShowCities] = useState(false);

  const { countryData, topCountries, topCities, regions } = useMemo(() => {
    const data: Record<string, CountryData> = {};
    const cityMap = new Map<
      string,
      { count: number; coordinates: [number, number] }
    >();
    const regionCounts: Record<string, number> = {};

    documentViews.forEach((view) => {
      if (view.country) {
        const countryInfo = getCountryData(view.country);
        if (countryInfo) {
          const countryKey = countryInfo.countryNameEn;

          if (!data[countryKey]) {
            data[countryKey] = {
              count: 0,
              countryCode: countryInfo.countryCode,
              name: countryInfo.countryNameEn,
              region: countryInfo.region,
              flag: countryInfo.flag,
              cities: [],
            };
          }

          data[countryKey].count += 1;

          // Track region data
          if (countryInfo.region) {
            regionCounts[countryInfo.region] =
              (regionCounts[countryInfo.region] || 0) + 1;
          }

          // Track city data if available
          if (view.city && view.latitude && view.longitude) {
            const cityKey = `${view.city}-${view.country}`;
            const existing = cityMap.get(cityKey);

            if (existing) {
              existing.count += 1;
            } else {
              cityMap.set(cityKey, {
                count: 1,
                coordinates: [view.longitude, view.latitude],
              });
            }

            // Add city to country data
            const cityData = cityMap.get(cityKey);
            if (
              cityData &&
              !data[countryKey].cities.find((c) => c.name === view.city)
            ) {
              data[countryKey].cities.push({
                name: view.city!,
                count: cityData.count,
                coordinates: cityData.coordinates,
              });
            }
          }
        }
      }
    });

    const sortedCountries = Object.values(data)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const allCities = Object.values(data)
      .flatMap((country) => country.cities)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      countryData: data,
      topCountries: sortedCountries,
      topCities: allCities,
      regions: Object.entries(regionCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([name, count]) => ({ name, count })),
    };
  }, [documentViews]);

  const maxCount = Math.max(
    ...Object.values(countryData).map((d) => d.count),
    1
  );

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.2 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.2 }));
  };

  const handleReset = () => {
    setPosition({ coordinates: [0, 30], zoom: 1 });
  };

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
        {topCountries.map((country) => (
          <Card key={country.countryCode} className='bg-black/5'>
            <CardHeader className='py-2'>
              <CardTitle className='text-sm font-medium truncate flex items-center gap-2'>
                <span>{country.flag}</span>
                <span>{country.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='pb-2'>
              <div className='text-2xl font-bold'>{country.count}</div>
              <p className='text-xs text-muted-foreground'>
                {((country.count / documentViews.length) * 100).toFixed(1)}% of
                total views
              </p>
              <p className='text-xs text-muted-foreground mt-1'>
                {country.region}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <CardTitle>Geographic Distribution</CardTitle>
            <div className='flex items-center gap-2'>
              {topCities.length > 0 && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setShowCities(!showCities)}
                >
                  {showCities ? 'Hide Cities' : 'Show Cities'}
                </Button>
              )}
              <Button variant='outline' size='sm' onClick={handleReset}>
                <Maximize2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='w-full rounded-lg relative'>
            <Tooltip.Provider>
              <ComposableMap projection='geoMercator'>
                <ZoomableGroup
                  center={position.coordinates as [number, number]}
                  zoom={position.zoom}
                  onMoveEnd={setPosition}
                  maxZoom={8}
                >
                  <Geographies geography={geoMap}>
                    {({ geographies }) => {
                      return geographies.map((geo) => {
                        const countryName = geo.properties.name;
                        const d = countryData[countryName];
                        const fillColor = d
                          ? `rgba(0, 0, 0, ${(d.count / maxCount) * 0.8})`
                          : '#e5e7eb';
                        return (
                          <Tooltip.Root key={geo.rsmKey}>
                            <Tooltip.Trigger asChild>
                              <Geography
                                geography={geo}
                                fill={fillColor}
                                stroke='#ffffff'
                                strokeWidth={0.5}
                                onMouseEnter={() => {
                                  const content = d
                                    ? `${d.flag} ${countryName}: ${d.count} views`
                                    : `${countryName}: 0 views`;
                                  setTooltipContent(content);
                                }}
                                style={{
                                  default: { outline: 'none' },
                                  hover: { outline: 'none', fill: '#000000' },
                                  pressed: { outline: 'none' },
                                }}
                              />
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content
                                className='bg-black text-white p-2 rounded shadow-lg text-sm'
                                sideOffset={5}
                              >
                                {tooltipContent}
                                <Tooltip.Arrow className='fill-black' />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        );
                      });
                    }}
                  </Geographies>

                  {showCities &&
                    position.zoom > 2 &&
                    topCities.map((city, i) => (
                      <Marker
                        key={`${city.name}-${i}`}
                        coordinates={city.coordinates}
                      >
                        <circle
                          r={4}
                          fill='#000'
                          stroke='#fff'
                          strokeWidth={1}
                        />
                        <text
                          textAnchor='middle'
                          y={-10}
                          style={{
                            fontFamily: 'system-ui',
                            fontSize: '8px',
                            fill: '#000',
                          }}
                        >
                          {city.name}
                        </text>
                      </Marker>
                    ))}
                </ZoomableGroup>
              </ComposableMap>
            </Tooltip.Provider>

            <div className='absolute bottom-4 right-4 flex flex-col gap-2'>
              <Button
                size='icon'
                variant='outline'
                onClick={handleZoomIn}
                className='h-8 w-8 bg-white'
              >
                <Plus className='h-4 w-4' />
              </Button>
              <Button
                size='icon'
                variant='outline'
                onClick={handleZoomOut}
                className='h-8 w-8 bg-white'
              >
                <Minus className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid gap-4 md:grid-cols-2'>
        {topCities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top Cities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                {topCities.map((city, i) => (
                  <Badge
                    key={`${city.name}-${i}`}
                    variant='secondary'
                    className='text-sm'
                  >
                    {city.name} ({city.count})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Regions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
              {regions.map((region, i) => (
                <Badge key={i} variant='secondary' className='text-sm'>
                  {region.name} ({region.count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
