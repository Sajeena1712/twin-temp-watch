import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const DigitalTwin = () => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Generate random temperature between 10°C and 50°C
  const generateTemperature = useCallback(() => {
    return Math.floor(Math.random() * (50 - 10 + 1)) + 10;
  }, []);

  // Start temperature monitoring
  const startMonitoring = useCallback(() => {
    setTemperature(generateTemperature());
    setIsMonitoring(true);
  }, [generateTemperature]);

  // Stop temperature monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  // Set up 5-second interval for temperature updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMonitoring) {
      interval = setInterval(() => {
        setTemperature(generateTemperature());
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isMonitoring, generateTemperature]);

  // Get temperature color based on value
  const getTemperatureColor = (temp: number) => {
    if (temp <= 20) return 'text-temp-cold';
    if (temp <= 35) return 'text-temp-normal';
    return 'text-temp-hot';
  };

  // Get temperature status
  const getTemperatureStatus = (temp: number) => {
    if (temp <= 20) return 'COOL';
    if (temp <= 35) return 'NORMAL';
    return 'HOT';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 text-center border-border bg-card/50 backdrop-blur-sm shadow-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-tech-primary to-tech-secondary bg-clip-text text-transparent">
            Digital Twin
          </h1>
          <p className="text-lg text-muted-foreground">Machine Temperature</p>
        </div>

        {/* Temperature Display */}
        <div className="mb-8">
          {temperature !== null ? (
            <div className="space-y-4">
              <div className="relative">
                <div className={`text-6xl font-bold ${getTemperatureColor(temperature)} transition-all duration-300`}
                     style={{ textShadow: '0 0 20px currentColor' }}>
                  {temperature}°C
                </div>
                <div className="absolute inset-0 opacity-30 blur-lg">
                  <div className={`text-6xl font-bold ${getTemperatureColor(temperature)}`}>
                    {temperature}°C
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  temperature <= 20 ? 'bg-temp-cold' : 
                  temperature <= 35 ? 'bg-temp-normal' : 'bg-temp-hot'
                } animate-pulse`}></div>
                <span className="text-sm font-medium text-muted-foreground">
                  Status: {getTemperatureStatus(temperature)}
                </span>
              </div>

              {isMonitoring && (
                <div className="text-xs text-muted-foreground">
                  Auto-updating every 5 seconds...
                </div>
              )}
            </div>
          ) : (
            <div className="text-muted-foreground text-lg">
              No temperature data available
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="space-y-3">
          {!isMonitoring ? (
            <Button 
              onClick={startMonitoring}
              className="w-full bg-gradient-to-r from-tech-primary to-tech-secondary hover:from-tech-accent hover:to-tech-primary text-primary-foreground font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ boxShadow: '0 0 20px hsl(var(--tech-primary) / 0.3)' }}
            >
              Show Temperature
            </Button>
          ) : (
            <Button 
              onClick={stopMonitoring}
              variant="outline"
              className="w-full border-tech-primary text-tech-primary hover:bg-tech-primary hover:text-primary-foreground transition-all duration-300"
            >
              Stop Monitoring
            </Button>
          )}
        </div>

        {/* Machine Info */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Machine ID</div>
              <div className="font-mono text-tech-primary">#DT-001</div>
            </div>
            <div>
              <div className="text-muted-foreground">Status</div>
              <div className={`font-semibold ${isMonitoring ? 'text-temp-normal' : 'text-muted-foreground'}`}>
                {isMonitoring ? 'ONLINE' : 'STANDBY'}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DigitalTwin;