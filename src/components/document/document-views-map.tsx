'use client';

import React, { useMemo, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { geoMap } from '@/lib/constants/geo-map';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Plus, Minus } from 'lucide-react';
import { DocumentView } from '@/app/document/[documentId]/columns';

type DocumentViewsMapProps = {
  documentViews: DocumentView[];
};

export default function DocumentViewsMap({
  documentViews,
}: DocumentViewsMapProps) {
  const [tooltipContent, setTooltipContent] = useState('');
  const [position, setPosition] = useState({ coordinates: [0, 30], zoom: 1 });

  console.log(documentViews);

  const countryData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    documentViews.forEach((view) => {
      if (view.country) {
        counts[view.country] = (counts[view.country] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([country, count]) => ({
      country,
      count,
    }));
  }, [documentViews]);

  const maxViews = Math.max(...countryData.map((d) => d.count));

  const colorScale = scaleLinear<string>()
    .domain([0, maxViews])
    .range(['#60a5fa', '#172554']);

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
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const d = countryData.find(
                      (s) => s.country === geo.properties.name
                    );
                    return (
                      <Tooltip.Root key={geo.rsmKey}>
                        <Tooltip.Trigger asChild>
                          <Geography
                            geography={geo}
                            fill={d ? colorScale(d.count) : '#9ca3af'}
                            stroke='#FFFFFF'
                            strokeWidth={0.5}
                            onMouseEnter={() => {
                              setTooltipContent(
                                `${geo.properties.name}: ${
                                  d ? d.count : 0
                                } views`
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
                  })
                }
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
    </div>
  );
}
