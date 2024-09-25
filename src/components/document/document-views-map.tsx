'use client';

import React, { useMemo, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { geoMap } from '@/lib/constants/geo-map';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Plus, Minus } from 'lucide-react';
import { DocumentView } from '@/app/document/[documentId]/columns';
import getCountryData from '@/lib/helpers/get-country-data';

type DocumentViewsMapProps = {
  documentViews: DocumentView[];
};

export default function DocumentViewsMap({
  documentViews,
}: DocumentViewsMapProps) {
  const [tooltipContent, setTooltipContent] = useState('');
  const [position, setPosition] = useState({ coordinates: [0, 30], zoom: 1 });

  const countryData = useMemo(() => {
    const counts: { [key: string]: { count: number; name: string } } = {};
    documentViews.forEach((view) => {
      if (view.country && view.country !== 'MOCKCOUNTRY') {
        const countryInfo = getCountryData(view.country);
        if (countryInfo) {
          const countryName = countryInfo.countryNameEn;
          if (!counts[countryName]) {
            counts[countryName] = {
              count: 0,
              name: countryName,
            };
          }
          counts[countryName].count += 1;
        }
      }
    });
    return counts;
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

  const handleMoveEnd = (position: any) => {
    setPosition(position);
  };

  return (
    <div>
      <h3 className='text-lg font-semibold mb-2'>Visitors Geodata</h3>
      <div className='w-full px-4 sm:px-8 shadow-sm rounded-lg relative'>
        <Tooltip.Provider>
          <ComposableMap projection='geoMercator'>
            <ZoomableGroup
              center={position.coordinates as [number, number]}
              zoom={position.zoom}
              onMoveEnd={handleMoveEnd}
            >
              <Geographies geography={geoMap}>
                {({ geographies }) => {
                  return geographies.map((geo) => {
                    const countryName = geo.properties.name;
                    const d = countryData[countryName];
                    const fillColor = d
                      ? `rgba(23, 37, 84, ${d.count / maxCount})`
                      : '#e5e7eb';
                    return (
                      <Tooltip.Root key={geo.rsmKey}>
                        <Tooltip.Trigger asChild>
                          <Geography
                            geography={geo}
                            fill={fillColor}
                            stroke='#FFFFFF'
                            strokeWidth={0.5}
                            onMouseEnter={() => {
                              setTooltipContent(
                                `${countryName}: ${d ? d.count : 0} views`
                              );
                            }}
                            style={{
                              default: { outline: 'none' },
                              hover: { outline: 'none', fill: '#172554' },
                              pressed: { outline: 'none' },
                            }}
                          />
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className='bg-blue-950 text-white p-2 rounded shadow-lg text-sm'
                            sideOffset={5}
                          >
                            {tooltipContent}
                            <Tooltip.Arrow className='fill-blue-950' />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    );
                  });
                }}
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </Tooltip.Provider>
        <div className='absolute bottom-4 right-8 flex flex-col gap-2'>
          <button
            onClick={handleZoomIn}
            className='bg-white p-2 rounded-full shadow-md opacity-50 hover:opacity-100'
          >
            <Plus size={18} />
          </button>
          <button
            onClick={handleZoomOut}
            className='bg-white p-2 rounded-full shadow-md opacity-50 hover:opacity-100'
          >
            <Minus size={18} />
          </button>
        </div>
      </div>
      <div className='mt-4'>
        <h4 className='font-semibold'>Debug Info:</h4>
        <pre className='bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto max-h-40'>
          {JSON.stringify(countryData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
