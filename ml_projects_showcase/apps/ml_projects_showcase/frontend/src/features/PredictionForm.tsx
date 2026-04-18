import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Spinner } from '../components/ui/spinner';
import { rpcCall } from '../api';

interface Feature {
  id: string;
  name: string;
  type: 'categorical' | 'number';
  options?: string[];
  min?: number;
  max?: number;
}

interface PredictionFormProps {
  projectId: string;
  features: Feature[];
  onPrediction: (result: any) => void;
}

export function PredictionForm({ projectId, features, onPrediction }: PredictionFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log('[ACTION_START] predict', { projectId, formData });

    try {
      const func = projectId === 'obesity' ? 'predict_obesity' : 'predict_breast_cancer';
      const result = await rpcCall({
        func,
        args: { features: formData }
      });
      onPrediction(result);
    } catch (err: any) {
      console.error('[FETCH_ERROR]', err);
      setError(err.message || 'Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleFillSample = () => {
    const sample: Record<string, any> = {};
    features.forEach(f => {
      if (f.type === 'categorical' && f.options && f.options.length > 0) {
        // Try to pick a sensible default or just the first one
        sample[f.id] = f.options[0];
      } else if (f.type === 'number') {
        const min = f.min ?? 0;
        const max = f.max ?? (min + 10);
        sample[f.id] = (min + max) / 2;
      }
    });
    setFormData(sample);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-heading">Prediction Tool</CardTitle>
            <CardDescription>Enter parameters to test the model</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleFillSample}>
            Fill Sample Data
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div key={feature.id} className="space-y-2">
                <Label htmlFor={feature.id}>{feature.name}</Label>
                {feature.type === 'categorical' ? (
                  <Select
                    value={formData[feature.id]}
                    onValueChange={(val) => handleInputChange(feature.id, val)}
                  >
                    <SelectTrigger id={feature.id}>
                      <SelectValue placeholder={`Select ${feature.name}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {feature.options?.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={feature.id}
                    type="number"
                    step="any"
                    min={feature.min}
                    max={feature.max}
                    placeholder={feature.name}
                    value={formData[feature.id] || ''}
                    onChange={(e) => handleInputChange(feature.id, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner className="mr-2 h-4 w-4" /> : null}
            Generate Prediction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
