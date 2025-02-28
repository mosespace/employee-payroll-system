'use client';

import type React from 'react';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  QrCode,
  Mail,
  Download,
  Share2,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
// import QRCode from 'qrcode.react';
import { generatePDF } from '@/lib/generate-pdf';
import { sharePayroll } from '@/lib/share-payroll';
import { toast } from '@mosespace/toast';

interface PayrollActionsProps {
  payroll: any; // Replace with proper type
}

export function PayrollActions({ payroll }: PayrollActionsProps) {
  const [showQR, setShowQR] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copying, setCopying] = useState(false);
  const [emailTo, setEmailTo] = useState('');

  const payrollUrl = `/dashboard/payroll/${payroll.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(payrollUrl);
      setCopying(true);
      toast.success(
        'Link copied',
        'The payroll link has been copied to your clipboard.',
      );
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      toast.error('Error', 'Failed to copy link to clipboard.');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await generatePDF(payroll);
      toast.success(
        'PDF downloaded',
        'The payroll PDF has been downloaded successfully.',
      );
    } catch (error) {
      toast.error('Error', 'Failed to download PDF.');
    }
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sharePayroll(payroll, emailTo);
      setShowShare(false);
      setEmailTo('');
      toast.success(
        'Payroll shared',
        'The payroll has been shared successfully.',
      );
    } catch (error) {
      toast.error('Error', 'Failed to share payroll.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            Share or download payroll information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Share Button */}
          <Dialog open={showShare} onOpenChange={setShowShare}>
            <DialogTrigger asChild>
              <Button disabled className="w-full" variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Share via Email
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Payroll</DialogTitle>
                <DialogDescription>
                  Send this payroll information via email
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleShare} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter recipient's email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Email
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Download PDF Button */}
          <Button
            className="w-full"
            variant="outline"
            onClick={handleDownloadPDF}
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>

          {/* Print Button */}
          <Button
            disabled
            className="w-full"
            variant="outline"
            onClick={handlePrint}
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>

          {/* QR Code Button */}
          <Dialog open={showQR} onOpenChange={setShowQR}>
            <DialogTrigger asChild>
              <Button disabled className="w-full" variant="outline">
                <QrCode className="mr-2 h-4 w-4" />
                Show QR Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Payroll QR Code</DialogTitle>
                <DialogDescription>
                  Scan this QR code to view the payroll details
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center p-4">
                {/* <QRCode value={payrollUrl} size={200} /> */}
              </div>
            </DialogContent>
          </Dialog>

          {/* Copy Link Button */}
          <Button className="w-full" variant="outline" onClick={handleCopyLink}>
            {copying ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Share Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Share Preview</CardTitle>
          <CardDescription>Preview of shared content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Payroll Details</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Payment reference: {payroll.id}
            </p>
            <p className="text-sm text-muted-foreground">
              Amount: ${payroll.payment.amount.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
