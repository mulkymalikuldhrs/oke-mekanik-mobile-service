
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/components/LoadingSpinner';
import ErrorDisplay from '@/components/ui/components/ErrorDisplay';

/**
 * Fetches the tracking data for a specific job from the API.
 * @param {string | undefined} id The ID of the job to track.
 * @returns {Promise<any>} A promise that resolves to the tracking data.
 */
const fetchTrackingData = async (id: string | undefined) => {
  if (!id) throw new Error("No tracking ID provided");
  const response = await fetch(`http://localhost:3001/bookings/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

/**
 * Renders the tracking page, displaying the real-time status of a service request.
 */
const TrackingPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ['tracking', id],
    queryFn: () => fetchTrackingData(id),
    refetchInterval: 5000, // Refetch every 5 seconds for live tracking feel
  });

  const statusSteps = [
    { key: 'Scheduled', label: 'Dijadwalkan', icon: Clock, color: 'bg-gray-500' },
    { key: 'In Progress', label: 'Sedang Dikerjakan', icon: Clock, color: 'bg-orange-500' },
    { key: 'Completed', label: 'Selesai', icon: CheckCircle, color: 'bg-green-500' }
  ];

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error.message} />;

  const { status, estimatedCompletion } = data;
  const currentStatusIndex = statusSteps.findIndex(step => step.key === status);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Tracking Job #{id}</h1>
          <p className="text-gray-600">Pantau progress pekerjaan secara real-time</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Status Saat Ini
              </div>
              <Badge className={`${statusSteps[currentStatusIndex]?.color || 'bg-gray-500'} text-white`}>
                {status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Live map coming soon</p>
              </div>
            </div>

            <div className="space-y-4">
              {statusSteps.map((step, index) => {
                const isActive = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const StepIcon = step.icon;

                return (
                  <div key={step.key} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive ? step.color : 'bg-gray-300'
                    } text-white`}>
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-700'}`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {estimatedCompletion && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-blue-800 font-semibold">
                  Estimasi Selesai
                </p>
                <p className="text-blue-600 text-lg">
                  {new Date(estimatedCompletion).toLocaleTimeString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center justify-center">
            <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
            <p className="text-sm text-red-800">
              Butuh bantuan darurat? Hubungi customer service kami.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackingPage;
