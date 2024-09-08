import React, { useState } from 'react';
import { FileMetadata } from '@/lib/types';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from './ui/sheet';
import { Settings2 } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';

interface DocumentSettings {
  isPublic: boolean;
  allowDownload: boolean;
  requireEmail: boolean;
  expirationDate: string;
  requirePassword: boolean;
  password: string;
  enableFeedback: boolean;
  requireNDA: boolean;
  ndaText: string;
}

export default function DocumentSettingsSheet({
  file,
}: {
  file: FileMetadata;
}) {
  const [settings, setSettings] = useState<DocumentSettings>({
    isPublic: file.is_public ?? true,
    allowDownload: file.allow_download ?? false,
    requireEmail: file.require_email ?? false,
    expirationDate: file.expiration_date ?? new Date().toISOString(),
    requirePassword: file.require_password ?? false,
    password: file.password ?? '',
    enableFeedback: file.enable_feedback ?? false,
    requireNDA: file.require_nda ?? false,
    ndaText: file.nda_text ?? '',
  });

  const handleSettingChange = (
    setting: keyof DocumentSettings,
    value: boolean | string
  ) => {
    setSettings((prev) => ({ ...prev, [setting]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      // Implement your save logic here
      console.log('Saving settings:', settings);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className='p-1 bg-gray-100 border hover:bg-gray-200 rounded-sm'>
          <span className='sr-only'>Settings</span>
          <Settings2 size={14} />
        </button>
      </SheetTrigger>
      <SheetContent className='bg-white overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>{file.original_name}</SheetTitle>
          <SheetDescription>Manage your document settings</SheetDescription>
        </SheetHeader>
        <div className='py-4 space-y-6'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='is-public'>Public</Label>
            <Switch
              id='is-public'
              checked={settings.isPublic}
              onCheckedChange={(checked) =>
                handleSettingChange('isPublic', checked)
              }
            />
          </div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='require-email'>Require email to view</Label>
            <Switch
              id='require-email'
              checked={settings.requireEmail}
              onCheckedChange={(checked) =>
                handleSettingChange('requireEmail', checked)
              }
            />
          </div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='allow-download'>Allow downloading</Label>
            <Switch
              id='allow-download'
              checked={settings.allowDownload}
              onCheckedChange={(checked) =>
                handleSettingChange('allowDownload', checked)
              }
            />
          </div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='enable-feedback'>
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
          <div className='space-y-2'>
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='expires'
                checked={!!settings.expirationDate}
                onCheckedChange={(checked) =>
                  handleSettingChange(
                    'expirationDate',
                    checked ? new Date().toISOString() : ''
                  )
                }
              />
              <Label htmlFor='expires'>Expires</Label>
            </div>
            <div className='flex space-x-2'>
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
                  const [date, _] = settings.expirationDate.split('T');
                  handleSettingChange(
                    'expirationDate',
                    `${date}T${e.target.value}:00Z`
                  );
                }}
              />
            </div>
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
              <Label htmlFor='require-password'>Passcode</Label>
            </div>
            <Input
              type='password'
              value={settings.password}
              onChange={(e) => handleSettingChange('password', e.target.value)}
              placeholder='Enter passcode'
            />
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
              <Label htmlFor='require-nda'>Require NDA</Label>
            </div>
            <Textarea
              value={settings.ndaText}
              onChange={(e) => handleSettingChange('ndaText', e.target.value)}
              placeholder='Enter NDA text'
              rows={3}
            />
          </div>
        </div>
        <SheetFooter className='flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-x-4 sm:space-y-0'>
          <Button onClick={handleSaveSettings} className='w-full sm:w-auto'>
            Save Settings
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
