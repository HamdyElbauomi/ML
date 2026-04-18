import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { rpcCall } from '../api';
import { Spinner } from '../components/ui/spinner';
import { ScrollArea } from '../components/ui/scroll-area';

interface DataExplorerProps {
  projectId: string;
}

export function DataExplorer({ projectId }: DataExplorerProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await rpcCall({
        func: 'get_data_sample',
        args: { project_id: projectId, n: 8 }
      });
      setData(result);
    } catch (err) {
      console.error('Failed to fetch data sample', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  if (loading) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </Card>
    );
  }

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="font-heading">Data Explorer</CardTitle>
          <CardDescription>Sample of the raw training dataset</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={fetchData}>
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full h-[400px]">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                {columns.map(col => (
                  <TableHead key={col} className="whitespace-nowrap">{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  {columns.map(col => (
                    <TableCell key={`${i}-${col}`} className="max-w-[200px] truncate">
                      {typeof row[col] === 'number' ? row[col].toFixed(2) : String(row[col])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
