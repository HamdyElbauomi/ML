import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PredictionResultsProps {
  result: {
    prediction: string;
    probability: Record<string, number>;
  } | null;
  projectId: string;
}

export function PredictionResults({ result, projectId }: PredictionResultsProps) {
  if (!result) {
    return (
      <Card className="h-full flex items-center justify-center border-dashed border-2">
        <div className="text-center p-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="text-muted-foreground text-xl">?</span>
          </div>
          <h3 className="font-heading font-semibold text-lg">No Prediction Yet</h3>
          <p className="text-muted-foreground text-sm max-w-[240px] mt-1">
            Fill out the form to see model results and probability distribution.
          </p>
        </div>
      </Card>
    );
  }

  const chartData = Object.entries(result.probability).map(([name, value]) => ({
    name,
    probability: (value * 100).toFixed(1),
    rawValue: value
  })).sort((a, b) => b.rawValue - a.rawValue);

  const isObesity = projectId === 'obesity';
  const displayPrediction = isObesity ? result.prediction : (result.prediction === 'M' ? 'Malignant' : 'Benign');
  const badgeVariant = !isObesity && result.prediction === 'M' ? 'destructive' : 'default';

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-heading text-sm font-medium text-muted-foreground uppercase tracking-wider">Model Output</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-3xl font-bold font-heading">{displayPrediction}</div>
              <p className="text-sm text-muted-foreground">Highest probability class</p>
            </div>
            <Badge variant={badgeVariant} className="px-4 py-1 text-sm rounded-full">
              Confidence: {Math.max(...Object.values(result.probability)).toLocaleString(undefined, {style: 'percent'})}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Probability Distribution</CardTitle>
          <CardDescription>Confidence levels across all classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background/95 backdrop-blur-md border rounded-lg shadow-xl p-3">
                          <p className="font-medium text-sm">{payload[0].payload.name}</p>
                          <p className="text-primary font-bold">{payload[0].value}% Confidence</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="probability" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name === result.prediction || (projectId === 'breast_cancer' && entry.name === result.prediction) 
                        ? 'hsl(var(--primary))' 
                        : 'hsl(var(--primary)/0.2)'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
