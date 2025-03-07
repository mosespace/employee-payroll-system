'use client';

import {
  clockIn,
  clockOut,
  getCurrentAttendanceStatus,
} from '@/actions/attendance';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { calculateHoursDifference, formatTime } from '@/utils/formatTime';
import { toast } from '@mosespace/toast';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Clock, LogIn, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Progress } from '../ui/progress';
import { createActivityLog } from '@/actions/logs';

interface ClockCardProps {
  userId: string;
}

type AttendanceStatus = 'NOT_CHECKED_IN' | 'CHECKED_IN' | 'CHECKED_OUT';

interface AttendanceState {
  status: AttendanceStatus;
  checkInTime?: Date;
  checkOutTime?: Date;
  totalHours?: number;
}

export function ClockCard({ userId }: ClockCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [attendanceState, setAttendanceState] = useState<AttendanceState>({
    status: 'NOT_CHECKED_IN',
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Updating current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());

      // Update progress if checked in
      if (
        attendanceState.status === 'CHECKED_IN' &&
        attendanceState.checkInTime
      ) {
        const startTime = attendanceState.checkInTime.getTime();
        const currentTimeMs = new Date().getTime();
        const eightHoursMs = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
        const elapsedMs = currentTimeMs - startTime;
        const newProgress = Math.min(100, (elapsedMs / eightHoursMs) * 100);
        setProgress(newProgress);
      }
    }, 1000);

    // Get current attendance status
    fetchAttendanceStatus();

    return () => clearInterval(timer);
  }, [attendanceState.status, attendanceState.checkInTime]);

  const fetchAttendanceStatus = async () => {
    const response = await getCurrentAttendanceStatus(userId);
    if (response.success) {
      const newState = {
        status: response?.data?.status as AttendanceStatus,
        checkInTime: response?.data?.checkInTime
          ? new Date(response?.data?.checkInTime)
          : undefined,
        checkOutTime: response?.data?.checkOutTime
          ? new Date(response?.data?.checkOutTime)
          : undefined,
        totalHours: response?.data?.totalHours ?? undefined,
      };

      setAttendanceState(newState);

      // Initialize progress if checked in
      if (newState.status === 'CHECKED_IN' && newState.checkInTime) {
        const startTime = newState.checkInTime.getTime();
        const currentTimeMs = new Date().getTime();
        const eightHoursMs = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
        const elapsedMs = currentTimeMs - startTime;
        const newProgress = Math.min(100, (elapsedMs / eightHoursMs) * 100);
        setProgress(newProgress);
      } else if (newState.status === 'CHECKED_OUT') {
        setProgress(100);
      }
    }
  };

  const handleClockIn = async () => {
    setLoading(true);
    try {
      const response = await clockIn(userId);
      if (response.success) {
        toast.success('Clocked In', 'You have successfully clocked in.');

        const data = {
          userId: '',
          action: 'check in',
          description: 'Checked Into the system',
          details: {
            status: 'Successfully',
          },
        };
        // create log
        await createActivityLog(data);
        await fetchAttendanceStatus();
      } else {
        toast.error('Error', `${response.message}` || 'Failed to clock in');
      }
    } catch (error) {
      toast.error('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      const response = await clockOut(userId);
      if (response.success) {
        toast.success('Clocked Out', 'You have successfully clocked out.');
        await fetchAttendanceStatus();
      } else {
        toast.error('Error', `${response.message}` || 'Failed to clock out');
      }
    } catch (error) {
      toast.error('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatCurrentDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = () => {
    switch (attendanceState.status) {
      case 'CHECKED_IN':
        return 'text-green-500';
      case 'CHECKED_OUT':
        return 'text-blue-500';
      default:
        return 'text-amber-500';
    }
  };

  const getStatusText = () => {
    switch (attendanceState.status) {
      case 'CHECKED_IN':
        return 'Currently Working';
      case 'CHECKED_OUT':
        return 'Shift Completed';
      default:
        return 'Not Checked In';
    }
  };

  const getStatusIcon = () => {
    switch (attendanceState.status) {
      case 'CHECKED_IN':
        return <Clock className="h-6 w-6 text-green-500" />;
      case 'CHECKED_OUT':
        return <CheckCircle2 className="h-6 w-6 text-blue-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-amber-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden border-none shadow-lg">
        <div className="bg-gradient-to-r from-primary/90 to-primary p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Employee Time Tracker
              </h2>
              <p className="text-primary-foreground/80 mt-1">
                Track your work hours efficiently
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-4xl font-bold tabular-nums">
                {formatCurrentTime()}
              </div>
              <div className="text-right text-primary-foreground/80 mt-1">
                {formatCurrentDate()}
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Status Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-muted p-3 rounded-full">
                  {getStatusIcon()}
                </div>
                <div>
                  <h3 className="text-lg font-medium">Current Status</h3>
                  <p className={`font-semibold ${getStatusColor()}`}>
                    {getStatusText()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Work Progress</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Based on standard 8-hour workday
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Clock In</div>
                  <div className="text-xl font-semibold mt-1">
                    {attendanceState.checkInTime
                      ? formatTime(attendanceState.checkInTime)
                      : '--:--'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Clock Out</div>
                  <div className="text-xl font-semibold mt-1">
                    {attendanceState.checkOutTime
                      ? formatTime(attendanceState.checkOutTime)
                      : '--:--'}
                  </div>
                </div>
              </div>
            </div>

            {/* Clock In/Out Section */}
            <div className="flex flex-col justify-between">
              <div className="md:hidden mb-6">
                <div className="text-3xl font-bold tabular-nums text-center">
                  {formatCurrentTime()}
                </div>
                <div className="text-center text-muted-foreground mt-1">
                  {formatCurrentDate()}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    Hours Today
                  </div>
                  <div className="text-3xl font-bold mt-1">
                    {attendanceState.status === 'CHECKED_OUT' &&
                    attendanceState.totalHours
                      ? `${attendanceState.totalHours.toFixed(2)} hours`
                      : attendanceState.status === 'CHECKED_IN' &&
                          attendanceState.checkInTime
                        ? calculateHoursDifference(
                            attendanceState.checkInTime,
                            new Date(),
                          )
                        : '0 h 0 m'}
                  </div>
                </div>

                {attendanceState.status === 'NOT_CHECKED_IN' && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="w-full h-16 text-lg"
                      onClick={handleClockIn}
                      disabled={loading}
                    >
                      <LogIn className="mr-2 h-5 w-5" />
                      Clock In
                    </Button>
                  </motion.div>
                )}

                {attendanceState.status === 'CHECKED_IN' && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="w-full h-16 text-lg"
                      variant="outline"
                      onClick={handleClockOut}
                      disabled={loading}
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Clock Out
                    </Button>
                  </motion.div>
                )}

                {attendanceState.status === 'CHECKED_OUT' && (
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <CheckCircle2 className="h-6 w-6 mx-auto text-green-500 mb-2" />
                    <p className="font-medium">
                      Your shift is complete for today
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      See you tomorrow!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
