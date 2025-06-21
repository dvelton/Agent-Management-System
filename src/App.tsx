import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { OrganizationChart } from './components/OrganizationChart'
import { Dashboard } from './components/Dashboard'
import { AgentLifecycle } from './components/AgentLifecycle'
import { Governance } from './components/Governance'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { initialAgentData } from './data/initialData'

function App() {
  // Initialize agent data in KV store if it doesn't exist
  const [agentData, setAgentData] = useKV('agent-data', initialAgentData)
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="organization">Organization</TabsTrigger>
              <TabsTrigger value="lifecycle">Lifecycle Management</TabsTrigger>
              <TabsTrigger value="governance">Governance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Management Dashboard</CardTitle>
                  <CardDescription>Overview of your agent workforce performance and statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <Dashboard agentData={agentData} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="organization" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Chart</CardTitle>
                  <CardDescription>Visualize and manage your agent hierarchy</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <OrganizationChart 
                    agentData={agentData} 
                    updateAgentData={setAgentData}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="lifecycle" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Lifecycle Management</CardTitle>
                  <CardDescription>Onboard, develop, and manage agent careers</CardDescription>
                </CardHeader>
                <CardContent>
                  <AgentLifecycle
                    agentData={agentData}
                    updateAgentData={setAgentData}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="governance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Governance & Compliance</CardTitle>
                  <CardDescription>Manage permissions, auditing, and compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <Governance
                    agentData={agentData}
                    updateAgentData={setAgentData}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

export default App