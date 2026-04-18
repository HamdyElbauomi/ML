import React, { useState, useEffect, useCallback } from 'react';
import { 
  Database, 
  Activity, 
  Settings, 
  LayoutDashboard, 
  ChevronRight,
  Menu,
  BrainCircuit,
  PieChart,
  Table as TableIcon
} from 'lucide-react';
import { SiPython, SiPandas, SiScikitlearn } from 'react-icons/si';

import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Separator } from './components/ui/separator';
import { Badge } from './components/ui/badge';
import { rpcCall } from './api';
import { cn } from './lib/utils';
import { Spinner } from './components/ui/spinner';

import { PredictionForm } from './features/PredictionForm';
import { PredictionResults } from './features/PredictionResults';
import { DataExplorer } from './features/DataExplorer';

function App() {
  const [projects, setProjects] = useState<any[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    console.log("RENDER_SUCCESS");
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await rpcCall({ func: 'get_projects' });
      setProjects(data);
      if (data.length > 0) setActiveProjectId(data[0].id);
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setLoading(false);
    }
  };

  const activeProject = projects.find(p => p.id === activeProjectId);

  const handlePrediction = (result: any) => {
    setPredictionResult(result);
  };

  // Reset prediction when project changes
  useEffect(() => {
    setPredictionResult(null);
    setActiveTab('overview');
  }, [activeProjectId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Spinner className="h-12 w-12 text-primary mx-auto" />
          <p className="text-muted-foreground font-heading animate-pulse">Initializing ML Lab Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col md:flex-row bg-background bg-dot-grid">
      {/* Sidebar Nav */}
      <aside className="hidden md:flex w-72 border-r bg-card/60 backdrop-blur-xl p-6 flex-col gap-6 z-20">
        <div className="flex items-center gap-3 px-2">
          <div className="rounded-xl bg-primary/10 p-2.5">
            <BrainCircuit className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-heading text-lg font-bold leading-tight tracking-tight">ML Lab</h1>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Project Showcase</span>
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-xs font-semibold text-muted-foreground px-4 uppercase tracking-wider mb-2">Projects</h2>
          {projects.map(project => (
            <button
              key={project.id}
              onClick={() => setActiveProjectId(project.id)}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 group relative",
                activeProjectId === project.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              )}
            >
              {project.id === 'obesity' ? <Activity className="h-4 w-4" /> : <Database className="h-4 w-4" />}
              <span className="font-medium truncate">{project.name}</span>
              {activeProjectId === project.id && (
                <div className="absolute right-3">
                  <ChevronRight className="h-3 w-3 opacity-50" />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-auto space-y-4">
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary/70">Stack</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-background/50 border-primary/20 py-1 flex gap-1.5 items-center">
                <SiPython className="h-3 w-3" /> Python
              </Badge>
              <Badge variant="outline" className="bg-background/50 border-primary/20 py-1 flex gap-1.5 items-center">
                <SiPandas className="h-3 w-3" /> Pandas
              </Badge>
              <Badge variant="outline" className="bg-background/50 border-primary/20 py-1 flex gap-1.5 items-center">
                <SiScikitlearn className="h-3 w-3" /> Scikit-learn
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-center p-2">
             <img src="./assets/logo-scikit-learn.png" alt="Scikit-Learn" className="h-8 object-contain grayscale opacity-50" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-6 relative scroll-smooth">
        {/* Mobile Header */}
        <header className="md:hidden border-b bg-card/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <h2 className="font-heading font-bold">ML Lab Showcase</h2>
          </div>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </header>

        {/* Hero Section */}
        <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden h-[300px] shadow-2xl group">
             <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('./assets/hero-neural-abstraction.png')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-primary/90 text-primary-foreground border-none">Active Model</Badge>
                <Badge variant="outline" className="text-white border-white/20 bg-white/5 backdrop-blur-sm">v2.4.0-stable</Badge>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white mb-2 max-w-2xl">
                {activeProject?.name}
              </h1>
              <p className="text-white/80 text-lg max-w-2xl font-light">
                {activeProject?.description}
              </p>
            </div>
          </div>

          {/* Project Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-6 bg-card/40 backdrop-blur-sm p-1.5 rounded-2xl border border-white/10">
              <TabsList className="bg-transparent gap-1">
                <TabsTrigger value="overview" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="data" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Data Sample
                </TabsTrigger>
                <TabsTrigger value="predict" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Prediction Lab
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 overflow-hidden bg-card/60 backdrop-blur-sm border-white/10 group">
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center gap-2">
                      <LayoutDashboard className="h-5 w-5 text-primary" />
                      About this Project
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-slate dark:prose-invert">
                    <p className="text-muted-foreground leading-relaxed">
                      This showcase demonstrates a practical application of machine learning. 
                      By analyzing complex feature sets, we can derive actionable insights and predictive capabilities 
                      with high precision.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      <div className="p-4 rounded-xl bg-muted/50 border space-y-2 group-hover:bg-primary/5 transition-colors">
                        <h4 className="font-heading text-sm font-semibold flex items-center gap-2">
                          <Settings className="h-4 w-4 text-primary" />
                          Feature Complexity
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {activeProject?.features.length} unique dimensions analyzed to form predictions.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/50 border space-y-2 group-hover:bg-primary/5 transition-colors">
                        <h4 className="font-heading text-sm font-semibold flex items-center gap-2">
                          <PieChart className="h-4 w-4 text-primary" />
                          Probability Model
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Outputs multiclass confidence distributions using optimized weights.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
                    <img 
                      src={activeProjectId === 'obesity' ? './assets/card-obesity-nutrition.jpg' : './assets/card-breast-cancer-lab.jpg'} 
                      alt="Project Context"
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[10px] uppercase font-bold text-white/70 tracking-widest">Domain Focus</span>
                      <p className="text-white font-medium text-sm">
                        {activeProjectId === 'obesity' ? 'Nutritional and health assessment' : 'Clinical diagnostic assistance'}
                      </p>
                    </div>
                  </div>
                  
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6 text-center space-y-3">
                      <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <BrainCircuit className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium">Ready to test the model?</p>
                      <Button onClick={() => setActiveTab('predict')} className="w-full rounded-xl">Launch Prediction Lab</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
               <DataExplorer projectId={activeProjectId} />
            </TabsContent>

            <TabsContent value="predict" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <PredictionForm 
                  projectId={activeProjectId} 
                  features={activeProject?.features || []} 
                  onPrediction={handlePrediction} 
                />
                <div className="sticky top-8">
                  <PredictionResults result={predictionResult} projectId={activeProjectId} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur-md flex justify-around py-3 z-40">
        {projects.map(project => (
          <button 
            key={project.id} 
            onClick={() => setActiveProjectId(project.id)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-medium transition-colors",
              activeProjectId === project.id ? "text-primary" : "text-muted-foreground"
            )}
          >
            {project.id === 'obesity' ? <Activity className="h-5 w-5" /> : <Database className="h-5 w-5" />}
            {project.id === 'obesity' ? 'Obesity' : 'Cancer'}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
