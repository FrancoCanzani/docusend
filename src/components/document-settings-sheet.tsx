import React, { ReactNode, useState } from 'react';
import { DocumentMetadata } from '@/lib/types';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from './ui/sheet';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { ndaText } from '@/lib/constants/nda-text';
import { saveDocumentSettings } from '@/lib/actions';
import { toast } from 'sonner';

interface DocumentSettings {
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

export default function DocumentSettingsSheet({
  documentMetadata,
  children,
}: {
  documentMetadata: DocumentMetadata;
  children: ReactNode;
}) {
  const [settings, setSettings] = useState<DocumentSettings>({
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
        success: () => {
          return `Settings saved successfully`;
        },
        error: 'Failed to update settings',
      }
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className='flex flex-col bg-white text-black'>
        <SheetHeader>
          <SheetTitle>{documentMetadata.original_name}</SheetTitle>
          <SheetDescription>Manage your document settings</SheetDescription>
        </SheetHeader>
        <div className='flex-grow overflow-y-auto py-4 space-y-6'>
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
              <Label htmlFor='expires'>Expires</Label>
            </div>
            {settings.isExpiring && (
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
              <Label htmlFor='require-password'>Passcode</Label>
            </div>
            {settings.requirePassword && (
              <Input
                type='password'
                value={settings.password}
                onChange={(e) =>
                  handleSettingChange('password', e.target.value)
                }
                placeholder='Enter passcode'
                required={settings.requirePassword}
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
              <Label htmlFor='require-nda'>Require NDA</Label>
            </div>
            {settings.requireNDA && (
              <Textarea
                value={settings.ndaText}
                onChange={(e) => handleSettingChange('ndaText', e.target.value)}
                placeholder='Enter NDA text'
                rows={3}
              />
            )}
          </div>
        </div>
        <SheetFooter className='pt-2'>
          <Button onClick={handleSaveSettings} className='w-full'>
            Save Settings
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
