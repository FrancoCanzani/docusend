'use client';

import React, { useState } from 'react';
import { DocumentMetadata } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
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

interface SettingSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingSection = ({
  title,
  description,
  children,
}: SettingSectionProps) => (
  <Card className='mb-6'>
    <CardHeader>
      <div className='flex items-center gap-2'>
        <h3 className='text-lg font-semibold'>{title}</h3>
      </div>
      <p className='text-sm text-gray-500'>{description}</p>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

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
        loading: 'Saving your document settings...',
        success: 'Settings saved successfully!',
        error: 'Failed to update settings. Please try again.',
      }
    );
  };

  return (
    <div className='w-full'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Document Settings</h1>
        <Button onClick={handleSaveSettings} variant={'outline'} size={'sm'}>
          Save Changes
        </Button>
      </div>

      <SettingSection
        title='Basic Information'
        description='Set the display name for your document'
      >
        <div>
          <Label htmlFor='document-name'>Document Name</Label>
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
      </SettingSection>

      <SettingSection
        title='Access Controls'
        description='Manage who can view and interact with your document'
      >
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <Label htmlFor='is-public' className='text-base font-medium'>
                Public Access
              </Label>
              <p className='text-sm text-gray-500'>
                When enabled, anyone with the link can view this document
              </p>
            </div>
            <Switch
              id='is-public'
              checked={settings.isPublic}
              onCheckedChange={(checked) =>
                handleSettingChange('isPublic', checked)
              }
            />
          </div>

          <div className='flex items-center justify-between'>
            <div>
              <Label htmlFor='require-email' className='text-base font-medium'>
                Email Requirement
              </Label>
              <p className='text-sm text-gray-500'>
                Request viewer email before allowing access
              </p>
            </div>
            <Switch
              id='require-email'
              checked={settings.requireEmail}
              onCheckedChange={(checked) =>
                handleSettingChange('requireEmail', checked)
              }
            />
          </div>

          <div className='flex items-center justify-between'>
            <div>
              <Label htmlFor='allow-download' className='text-base font-medium'>
                Download Permission
              </Label>
              <p className='text-sm text-gray-500'>
                Allow viewers to download the document
              </p>
            </div>
            <Switch
              id='allow-download'
              checked={settings.allowDownload}
              onCheckedChange={(checked) =>
                handleSettingChange('allowDownload', checked)
              }
            />
          </div>
        </div>
      </SettingSection>

      <SettingSection
        title='Security Settings'
        description='Add additional layers of security to your document'
      >
        <div className='space-y-6'>
          <div className='space-y-2'>
            <div className='flex items-start space-x-2'>
              <Checkbox
                id='require-password'
                checked={settings.requirePassword}
                onCheckedChange={(checked) =>
                  handleSettingChange('requirePassword', checked)
                }
                className='mt-1.5'
              />
              <div>
                <Label
                  htmlFor='require-password'
                  className='text-base font-medium'
                >
                  Password Protection
                </Label>
                <p className='text-sm text-gray-500'>
                  Require a password to access the document
                </p>
              </div>
            </div>
            {settings.requirePassword && (
              <Input
                type='password'
                value={settings.password}
                onChange={(e) =>
                  handleSettingChange('password', e.target.value)
                }
                placeholder='Enter password'
                required={settings.requirePassword}
                className='mt-2'
              />
            )}
          </div>

          <div className='space-y-2'>
            <div className='flex items-start space-x-2'>
              <Checkbox
                id='require-nda'
                checked={settings.requireNDA}
                onCheckedChange={(checked) =>
                  handleSettingChange('requireNDA', checked)
                }
                className='mt-1.5'
              />
              <div>
                <Label htmlFor='require-nda' className='text-base font-medium'>
                  NDA Requirement
                </Label>
                <p className='text-sm text-gray-500'>
                  Require viewers to accept an NDA before accessing
                </p>
              </div>
            </div>
            {settings.requireNDA && (
              <Textarea
                value={settings.ndaText}
                onChange={(e) => handleSettingChange('ndaText', e.target.value)}
                placeholder='Enter NDA text'
                rows={14}
                className='mt-2'
              />
            )}
          </div>
        </div>
      </SettingSection>

      <SettingSection
        title='Time & Feedback'
        description='Set expiration and manage feedback options'
      >
        <div className='space-y-6'>
          <div className='flex items-start space-x-2'>
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
                }
              }}
              className='mt-1.5'
            />
            <div>
              <Label htmlFor='expires' className='text-base font-medium'>
                Document Expiration
              </Label>
              <p className='text-sm text-gray-500'>
                Set an expiration date and time for access
              </p>
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

          <div className='flex items-center justify-between'>
            <div>
              <Label
                htmlFor='enable-feedback'
                className='text-base font-medium'
              >
                Viewer Feedback
              </Label>
              <p className='text-sm text-gray-500'>
                Allow viewers to provide comments and feedback
              </p>
            </div>
            <Switch
              id='enable-feedback'
              checked={settings.enableFeedback}
              onCheckedChange={(checked) =>
                handleSettingChange('enableFeedback', checked)
              }
            />
          </div>
        </div>
      </SettingSection>
    </div>
  );
}
