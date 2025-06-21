import { useState } from 'react'
import { AgentDataStore, AgentData } from '../data/initialData'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, DotsThree, CaretDown, CaretRight, PencilSimple } from '@phosphor-icons/react'

interface OrgChartProps {
  agentData: AgentDataStore
  updateAgentData: (data: AgentDataStore) => void
}

export function OrganizationChart({ agentData, updateAgentData }: OrgChartProps) {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "agent-001": true
  })
  const [selectedAgent, setSelectedAgent] = useState<AgentData | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [newAgentDialogOpen, setNewAgentDialogOpen] = useState(false)
  const [newAgentData, setNewAgentData] = useState({
    name: '',
    role: '',
    type: 'operational',
    reportsTo: '',
  })

  // Build agent hierarchy tree
  const buildHierarchyTree = () => {
    const rootAgents = Object.values(agentData.agents).filter(agent => agent.reports_to === null)
    return rootAgents
  }

  // Toggle expanded/collapsed state of a node
  const toggleNode = (agentId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [agentId]: !prev[agentId]
    }))
  }

  // Handle opening agent details dialog
  const handleAgentSelect = (agent: AgentData) => {
    setSelectedAgent(agent)
    setEditDialogOpen(true)
  }

  // Handle adding a new agent
  const handleAddAgent = () => {
    // Generate new agent ID
    const newAgentId = `agent-${Object.keys(agentData.agents).length + 1}`.padStart(9, '0')
    
    // Create new agent object
    const newAgent: AgentData = {
      id: newAgentId,
      name: newAgentData.name,
      role: newAgentData.role,
      type: newAgentData.type as 'strategic' | 'tactical' | 'administrative' | 'operational',
      status: 'onboarding',
      level: 1,
      capabilities: [],
      performance: {
        efficiency: 0,
        accuracy: 0,
        satisfaction: 0
      },
      permissions: ['basic_access'],
      reports_to: newAgentData.reportsTo || null,
      subordinates: [],
      created_at: new Date().toISOString(),
      last_review: null,
      model: "gpt-4o-mini",
      history: [
        {
          date: new Date().toLocaleDateString('en-US'),
          event: "onboarding",
          details: `Initial deployment as ${newAgentData.role}`
        }
      ]
    }
    
    // Add the new agent to the parent's subordinates
    const updatedAgents = { ...agentData.agents }
    
    if (newAgentData.reportsTo) {
      const parentAgent = updatedAgents[newAgentData.reportsTo]
      if (parentAgent) {
        parentAgent.subordinates = [...parentAgent.subordinates, newAgentId]
      }
    }
    
    // Add the new agent to the agents list
    updatedAgents[newAgentId] = newAgent
    
    // Update metrics
    const updatedMetrics = {
      ...agentData.metrics,
      total_agents: agentData.metrics.total_agents + 1
    }
    
    // Update the agent data store
    updateAgentData({
      ...agentData,
      agents: updatedAgents,
      metrics: updatedMetrics
    })
    
    // Close the dialog and reset form
    setNewAgentDialogOpen(false)
    setNewAgentData({
      name: '',
      role: '',
      type: 'operational',
      reportsTo: '',
    })
  }

  // Render agent organization chart
  const renderAgentNode = (agent: AgentData, depth: number = 0) => {
    const hasChildren = agent.subordinates.length > 0
    const isExpanded = expandedNodes[agent.id] || false
    
    return (
      <div key={agent.id} className="agent-node">
        <div 
          className={`flex items-center px-4 py-2 mb-1 rounded-md ${
            depth === 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/70'
          }`}
        >
          <div 
            className="mr-1 w-4 cursor-pointer" 
            onClick={() => hasChildren && toggleNode(agent.id)}
          >
            {hasChildren && (
              isExpanded ? <CaretDown className="h-4 w-4" /> : <CaretRight className="h-4 w-4" />
            )}
          </div>
          
          <div 
            className="flex-1 cursor-pointer truncate"
            onClick={() => handleAgentSelect(agent)}
          >
            <div className="font-medium">{agent.name}</div>
            <div className="text-xs opacity-70">{agent.role}</div>
          </div>
          
          <div className="flex items-center gap-1">
            <div className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadgeColor(agent.status)}`}>
              {agent.status}
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <DotsThree className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {isExpanded && hasChildren && (
          <div className="pl-6 border-l border-border ml-4 mt-1">
            {agent.subordinates.map(subId => {
              const subAgent = agentData.agents[subId]
              return subAgent ? renderAgentNode(subAgent, depth + 1) : null
            })}
          </div>
        )}
      </div>
    )
  }
  
  // Get badge color based on agent status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-700'
      case 'inactive': return 'bg-gray-200 text-gray-700'
      case 'onboarding': return 'bg-blue-500/20 text-blue-700'
      case 'review': return 'bg-amber-500/20 text-amber-700'
      default: return 'bg-gray-200 text-gray-700'
    }
  }
  
  // Get level name based on agent level number
  const getLevelName = (level: number) => {
    switch(level) {
      case 1: return 'Entry Level'
      case 2: return 'Junior Level'
      case 3: return 'Mid Level'
      case 4: return 'Senior Level'
      case 5: return 'Executive Level'
      default: return `Level ${level}`
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Agent Organization Structure</h3>
          <p className="text-sm text-muted-foreground">Manage your agent hierarchy and relationships</p>
        </div>
        
        <Dialog open={newAgentDialogOpen} onOpenChange={setNewAgentDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Agent</DialogTitle>
              <DialogDescription>
                Create a new agent in your organization. All agents start at entry level.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Agent Name</Label>
                <Input 
                  id="name" 
                  value={newAgentData.name}
                  onChange={(e) => setNewAgentData({...newAgentData, name: e.target.value})}
                  placeholder="e.g., Research Assistant" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="role">Role Title</Label>
                <Input 
                  id="role" 
                  value={newAgentData.role}
                  onChange={(e) => setNewAgentData({...newAgentData, role: e.target.value})}
                  placeholder="e.g., Information Retrieval Specialist" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Agent Type</Label>
                <Select 
                  value={newAgentData.type} 
                  onValueChange={(value) => setNewAgentData({...newAgentData, type: value})}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select agent type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strategic">Strategic</SelectItem>
                    <SelectItem value="tactical">Tactical</SelectItem>
                    <SelectItem value="administrative">Administrative</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="reports-to">Reports To</Label>
                <Select 
                  value={newAgentData.reportsTo}
                  onValueChange={(value) => setNewAgentData({...newAgentData, reportsTo: value})}
                >
                  <SelectTrigger id="reports-to">
                    <SelectValue placeholder="Select supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(agentData.agents).map(agent => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name} ({agent.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewAgentDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddAgent}>Add Agent</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-md bg-card p-4">
        <div className="org-chart-container space-y-2">
          {buildHierarchyTree().map(agent => renderAgentNode(agent))}
        </div>
      </div>
      
      {/* Agent Details Dialog */}
      {selectedAgent && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>{selectedAgent.name}</DialogTitle>
                <Button variant="outline" size="sm">
                  <PencilSimple className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
              <DialogDescription>
                {selectedAgent.role}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                  <div className={`inline-flex px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusBadgeColor(selectedAgent.status)}`}>
                    {selectedAgent.status}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Level</h4>
                  <p>{getLevelName(selectedAgent.level)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Type</h4>
                  <p className="capitalize">{selectedAgent.type}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Model</h4>
                  <p>{selectedAgent.model}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Performance</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-sm font-medium">Efficiency</div>
                    <div className="text-2xl font-bold">{selectedAgent.performance.efficiency}%</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Accuracy</div>
                    <div className="text-2xl font-bold">{selectedAgent.performance.accuracy}%</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Satisfaction</div>
                    <div className="text-2xl font-bold">{selectedAgent.performance.satisfaction}%</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Capabilities</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.capabilities.length > 0 ? (
                    selectedAgent.capabilities.map((capability, index) => (
                      <div key={index} className="px-3 py-1 bg-secondary rounded-full text-xs capitalize">
                        {capability}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No capabilities assigned yet</p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Reporting Structure</h4>
                <div className="space-y-2">
                  {selectedAgent.reports_to && (
                    <div>
                      <div className="text-sm">Reports to:</div>
                      <div className="font-medium">{agentData.agents[selectedAgent.reports_to]?.name || 'None'}</div>
                    </div>
                  )}
                  
                  {selectedAgent.subordinates.length > 0 && (
                    <div>
                      <div className="text-sm">Manages:</div>
                      <div className="font-medium">
                        {selectedAgent.subordinates.map(subId => agentData.agents[subId]?.name).join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Close</Button>
              <Button variant="default">Manage Capabilities</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}