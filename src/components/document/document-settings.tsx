'use client';

import React, { useState } from 'react';
import { DocumentMetadata } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ndaText } from '@/lib/constants/nda-text';
import { saveDocumentSettings } from '@/lib/actions';
import { toast } from 'sonner';

interface DocumentSettings {
  original_name: string;
  sanitized_name: string;
  isPublic: boolean;
  allowDownload: boolean;
  requireEmail: boolean;
  isExpiring: boolean;
  expirationDate: string;
  requirePassword: boolean;
  password: string;
  enableFeedback: boolean;
  requireNDA: boolean;
  ndaText: string;
}

export default function DocumentSettings({
  documentMetadata,
}: {
  documentMetadata: DocumentMetadata;
}) {
  const [settings, setSettings] = useState<DocumentSettings>({
    original_name: documentMetadata.original_name,
    sanitized_name: documentMetadata.sanitized_name,
    isPublic: documentMetadata.is_public ?? true,
    allowDownload: documentMetadata.allow_download ?? false,
    requireEmail: documentMetadata.require_email ?? false,
    isExpiring: documentMetadata.is_expiring ?? false,
    expirationDate:
      documentMetadata.expiration_date ?? new Date().toISOString(),
    requirePassword: documentMetadata.require_password ?? false,
    password: documentMetadata.password ?? '',
    enableFeedback: documentMetadata.enable_feedback ?? false,
    requireNDA: documentMetadata.require_nda ?? false,
    ndaText: documentMetadata.nda_text ?? ndaText,
  });

  const handleSettingChange = (
    setting: keyof DocumentSettings,
    value: boolean | string
  ) => {
    setSettings((prev) => ({ ...prev, [setting]: value }));
  };

  const handleSaveSettings = () => {
    toast.promise(
      saveDocumentSettings(documentMetadata.document_id, {
        original_name: settings.original_name,
        sanitized_name: settings.sanitized_name,
        is_public: settings.isPublic,
        allow_download: settings.allowDownload,
        require_email: settings.requireEmail,
        is_expiring: settings.isExpiring,
        expiration_date: settings.isExpiring ? settings.expirationDate : null,
        require_password: settings.requirePassword,
        password: settings.requirePassword ? settings.password : null,
        enable_feedback: settings.enableFeedback,
        require_nda: settings.requireNDA,
        nda_text: settings.requireNDA ? settings.ndaText : null,
      }),
      {
        loading: 'Saving...',
        success: () => 'Settings saved successfully',
        error: 'Failed to update settings',
      }
    );
  };

  return (
    <div className='mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Document Settings</h1>
      <div className='space-y-6'>
        <div>
          <Label htmlFor='document-name' className='text-lg font-semibold'>
            Document Name
          </Label>
          <Input
            id='document-name'
            type='text'
            value={settings.sanitized_name}
            className='mt-1'
            onChange={(e) => {
              const newName = e.target.value.trim();
              handleSettingChange('sanitized_name', newName);
              handleSettingChange('original_name', newName);
            }}
          />
        </div>

        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='is-public' className='text-lg'>
              Public
            </Label>
            <Switch
              id='is-public'
              checked={settings.isPublic}
              onCheckedChange={(checked) =>
                handleSettingChange('isPublic', checked)
              }
            />
          </div>

          <div className='flex items-center justify-between'>
            <Label htmlFor='require-email' className='text-lg'>
              Require email to view
            </Label>
            <Switch
              id='require-email'
              checked={settings.requireEmail}
              onCheckedChange={(checked) =>
                handleSettingChange('requireEmail', checked)
              }
            />
          </div>

          <div className='flex items-center justify-between'>
            <Label htmlFor='allow-download' className='text-lg'>
              Allow downloading
            </Label>
            <Switch
              id='allow-download'
              checked={settings.allowDownload}
              onCheckedChange={(checked) =>
                handleSettingChange('allowDownload', checked)
              }
            />
          </div>

          <div className='flex items-center justify-between'>
            <Label htmlFor='enable-feedback' className='text-lg'>
              Enable feedback from viewers
            </Label>
            <Switch
              id='enable-feedback'
              checked={settings.enableFeedback}
              onCheckedChange={(checked) =>
                handleSettingChange('enableFeedback', checked)
              }
            />
          </div>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='expires'
              checked={settings.isExpiring}
              onCheckedChange={(checked) => {
                handleSettingChange('isExpiring', checked);
                if (checked) {
                  handleSettingChange(
                    'expirationDate',
                    new Date().toISOString()
                  );
                } else {
                  handleSettingChange('expirationDate', '');
                }
              }}
            />
            <Label htmlFor='expires' className='text-lg'>
              Expires
            </Label>
          </div>
          {settings.isExpiring && (
            <div className='flex space-x-2 mt-2'>
              <Input
                type='date'
                value={settings.expirationDate.split('T')[0]}
                onChange={(e) =>
                  handleSettingChange(
                    'expirationDate',
                    `${e.target.value}T00:00:00Z`
                  )
                }
              />
              <Input
                type='time'
                value={settings.expirationDate.split('T')[1].slice(0, 5)}
                onChange={(e) => {
                  const [date] = settings.expirationDate.split('T');
                  handleSettingChange(
                    'expirationDate',
                    `${date}T${e.target.value}:00Z`
                  );
                }}
              />
            </div>
          )}
        </div>

        <div className='space-y-2'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='require-password'
              checked={settings.requirePassword}
              onCheckedChange={(checked) =>
                handleSettingChange('requirePassword', checked)
              }
            />
            <Label htmlFor='require-password' className='text-lg'>
              Passcode
            </Label>
          </div>
          {settings.requirePassword && (
            <Input
              type='password'
              value={settings.password}
              onChange={(e) => handleSettingChange('password', e.target.value)}
              placeholder='Enter passcode'
              required={settings.requirePassword}
              className='mt-2'
            />
          )}
        </div>

        <div className='space-y-2'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='require-nda'
              checked={settings.requireNDA}
              onCheckedChange={(checked) =>
                handleSettingChange('requireNDA', checked)
              }
            />
            <Label htmlFor='require-nda' className='text-lg'>
              Require NDA
            </Label>
          </div>
          {settings.requireNDA && (
            <Textarea
              value={settings.ndaText}
              onChange={(e) => handleSettingChange('ndaText', e.target.value)}
              placeholder='Enter NDA text'
              rows={8}
              className='mt-2'
            />
          )}
        </div>

        <div className='flex items-center justify-end'>
          <Button onClick={handleSaveSettings} className=''>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
