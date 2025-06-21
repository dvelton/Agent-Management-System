import { useState } from 'react'
import { AgentDataStore, AgentData } from '../data/initialData'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { CaretRight, CheckCircle, ClockCounterClockwise, PlusCircle, UsersThree } from '@phosphor-icons/react'

interface AgentLifecycleProps {
  agentData: AgentDataStore
  updateAgentData: (data: AgentDataStore) => void
}

export function AgentLifecycle({ agentData, updateAgentData }: AgentLifecycleProps) {
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<AgentData | null>(null)
  const [reviewData, setReviewData] = useState({
    efficiency: 0,
    accuracy: 0,
    satisfaction: 0,
    notes: '',
    action: 'maintain', // maintain, promote, transfer
    recommendedTraining: []
  })
  
  // Get agents by lifecycle stage
  const onboardingAgents = Object.values(agentData.agents).filter(a => a.status === 'onboarding')
  const activeAgents = Object.values(agentData.agents).filter(a => a.status === 'active')
  const reviewAgents = Object.values(agentData.agents).filter(a => a.status === 'review')

  // Handle agent review submission
  const handleReviewSubmit = () => {
    if (!selectedAgent) return
    
    // Create updated agent data
    const updatedAgent = { 
      ...selectedAgent,
      status: 'active',
      performance: {
        efficiency: reviewData.efficiency,
        accuracy: reviewData.accuracy,
        satisfaction: reviewData.satisfaction
      },
      last_review: new Date().toISOString(),
      history: [
        ...selectedAgent.history,
        {
          date: new Date().toLocaleDateString('en-US'),
          event: "performance_review",
          details: `Performance review conducted with ${reviewData.action === 'promote' ? 'promotion recommended' : 
                    reviewData.action === 'transfer' ? 'transfer recommended' : 'current role maintained'}`
        }
      ]
    }
    
    // Handle promotion if selected
    if (reviewData.action === 'promote' && selectedAgent.level < 5) {
      updatedAgent.level += 1
    }
    
    // Update agent data
    const updatedAgents = {
      ...agentData.agents,
      [selectedAgent.id]: updatedAgent
    }
    
    // Update data store
    updateAgentData({
      ...agentData,
      agents: updatedAgents,
      metrics: {
        ...agentData.metrics,
        efficiency_avg: calculateAverageMetric(updatedAgents, 'efficiency'),
        accuracy_avg: calculateAverageMetric(updatedAgents, 'accuracy'),
        satisfaction_avg: calculateAverageMetric(updatedAgents, 'satisfaction')
      }
    })
    
    // Close modal and reset form
    setReviewModalOpen(false)
    setSelectedAgent(null)
    setReviewData({
      efficiency: 0,
      accuracy: 0,
      satisfaction: 0,
      notes: '',
      action: 'maintain',
      recommendedTraining: []
    })
  }

  // Calculate average for a specific metric across all active agents
  const calculateAverageMetric = (agents: Record<string, AgentData>, metric: 'efficiency' | 'accuracy' | 'satisfaction') => {
    const activeAgents = Object.values(agents).filter(a => a.status === 'active')
    const sum = activeAgents.reduce((total, agent) => total + agent.performance[metric], 0)
    return activeAgents.length > 0 ? sum / activeAgents.length : 0
  }

  // Handle initiating a review for an agent
  const initiateReview = (agent: AgentData) => {
    // Create updated agent data
    const updatedAgent = { 
      ...agent,
      status: 'review',
      history: [
        ...agent.history,
        {
          date: new Date().toLocaleDateString('en-US'),
          event: "review_started",
          details: "Agent placed in review for performance evaluation"
        }
      ]
    }
    
    // Update agent data
    const updatedAgents = {
      ...agentData.agents,
      [agent.id]: updatedAgent
    }
    
    // Update data store
    updateAgentData({
      ...agentData,
      agents: updatedAgents
    })
  }

  // Handle completing onboarding for an agent
  const completeOnboarding = (agent: AgentData) => {
    // Create updated agent data
    const updatedAgent = { 
      ...agent,
      status: 'active',
      performance: {
        efficiency: 70, // Starting baseline metrics
        accuracy: 75,
        satisfaction: 80
      },
      history: [
        ...agent.history,
        {
          date: new Date().toLocaleDateString('en-US'),
          event: "onboarding_completed",
          details: "Agent successfully completed onboarding process"
        }
      ]
    }
    
    // Update agent data
    const updatedAgents = {
      ...agentData.agents,
      [agent.id]: updatedAgent
    }
    
    // Update data store
    updateAgentData({
      ...agentData,
      agents: updatedAgents,
      metrics: {
        ...agentData.metrics,
        active_agents: agentData.metrics.active_agents + 1,
        efficiency_avg: calculateAverageMetric(updatedAgents, 'efficiency'),
        accuracy_avg: calculateAverageMetric(updatedAgents, 'accuracy'),
        satisfaction_avg: calculateAverageMetric(updatedAgents, 'satisfaction')
      }
    })
  }

  // Open review modal for an agent
  const openReviewModal = (agent: AgentData) => {
    setSelectedAgent(agent)
    setReviewData({
      efficiency: agent.performance.efficiency,
      accuracy: agent.performance.accuracy,
      satisfaction: agent.performance.satisfaction,
      notes: '',
      action: 'maintain',
      recommendedTraining: []
    })
    setReviewModalOpen(true)
  }

  // Render agent cards by status
  const renderAgentCard = (agent: AgentData) => {
    return (
      <div key={agent.id} className="border rounded-md bg-card p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{agent.name}</h4>
            <p className="text-sm text-muted-foreground">{agent.role}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-xs bg-secondary px-2 py-1 rounded-md">
              Level {agent.level}
            </div>
            {agent.reports_to && (
              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                <UsersThree className="h-3 w-3 mr-1" />
                Reports to {agentData.agents[agent.reports_to]?.name || 'Unknown'}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 space-y-4">
          {/* Onboarding agents don't have performance metrics */}
          {agent.status !== 'onboarding' && (
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xs text-muted-foreground">Efficiency</div>
                <div className="font-medium">{agent.performance.efficiency}%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
                <div className="font-medium">{agent.performance.accuracy}%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Satisfaction</div>
                <div className="font-medium">{agent.performance.satisfaction}%</div>
              </div>
            </div>
          )}
          
          <div>
            <div className="text-xs text-muted-foreground mb-1">Key capabilities:</div>
            <div className="flex flex-wrap gap-1">
              {agent.capabilities.length > 0 ? (
                agent.capabilities.slice(0, 3).map((cap, i) => (
                  <div key={i} className="px-2 py-0.5 bg-secondary rounded-full text-xs">
                    {cap}
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground">No capabilities assigned</div>
              )}
              {agent.capabilities.length > 3 && (
                <div className="px-2 py-0.5 bg-secondary rounded-full text-xs">
                  +{agent.capabilities.length - 3} more
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-2 border-t border-border flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              {agent.last_review ? (
                <>Last review: {new Date(agent.last_review).toLocaleDateString()}</>
              ) : (
                <>Created: {new Date(agent.created_at).toLocaleDateString()}</>
              )}
            </div>
            
            {/* Conditional actions based on status */}
            {agent.status === 'onboarding' && (
              <Button size="sm" variant="outline" onClick={() => completeOnboarding(agent)}>
                <CheckCircle className="h-4 w-4 mr-1" /> Complete Onboarding
              </Button>
            )}
            
            {agent.status === 'active' && (
              <Button size="sm" variant="outline" onClick={() => initiateReview(agent)}>
                <ClockCounterClockwise className="h-4 w-4 mr-1" /> Start Review
              </Button>
            )}
            
            {agent.status === 'review' && (
              <Button size="sm" variant="default" onClick={() => openReviewModal(agent)}>
                <PlusCircle className="h-4 w-4 mr-1" /> Add Review
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Agent Lifecycle Management</h3>
        <p className="text-sm text-muted-foreground">Manage your agents through their entire lifecycle</p>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Agents ({activeAgents.length})</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding ({onboardingAgents.length})</TabsTrigger>
          <TabsTrigger value="review">In Review ({reviewAgents.length})</TabsTrigger>
          <TabsTrigger value="career">Career Paths</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeAgents.map(renderAgentCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="onboarding" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {onboardingAgents.length > 0 ? (
              onboardingAgents.map(renderAgentCard)
            ) : (
              <div className="col-span-full text-center py-10">
                <div className="text-muted-foreground">No agents currently in onboarding</div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="review" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviewAgents.length > 0 ? (
              reviewAgents.map(renderAgentCard)
            ) : (
              <div className="col-span-full text-center py-10">
                <div className="text-muted-foreground">No agents currently in review</div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="career" className="space-y-4">
          <div className="border rounded-lg bg-card p-6">
            <h3 className="text-lg font-medium mb-4">Agent Career Progression</h3>
            
            <div className="space-y-6">
              {[5, 4, 3, 2, 1].map(level => (
                <div key={level} className="relative">
                  <div className="flex items-center mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                      ${level === 5 ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                      {level}
                    </div>
                    <h4 className="ml-3 font-medium">
                      {level === 5 && 'Executive Level'}
                      {level === 4 && 'Senior Level'}
                      {level === 3 && 'Mid Level'}
                      {level === 2 && 'Junior Level'}
                      {level === 1 && 'Entry Level'}
                    </h4>
                  </div>
                  
                  <div className="ml-5 pl-9 border-l border-border pb-6">
                    <div className="text-sm text-muted-foreground mb-2">
                      {level === 5 && 'Strategic leadership, complex decision making, high autonomy'}
                      {level === 4 && 'Departmental leadership, advanced problem solving, high reliability'}
                      {level === 3 && 'Role specialization, independent operation, moderate complexity'}
                      {level === 2 && 'Specialized tasks, supervised operation, routine problem solving'}
                      {level === 1 && 'Basic operations, well-defined tasks, close supervision'}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
                      {Object.values(agentData.agents)
                        .filter(agent => agent.level === level)
                        .slice(0, 3)
                        .map(agent => (
                          <div 
                            key={agent.id} 
                            className="px-3 py-2 bg-background rounded border border-border flex items-center"
                          >
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              agent.status === 'active' ? 'bg-green-500' :
                              agent.status === 'review' ? 'bg-amber-500' :
                              'bg-blue-500'
                            }`}></div>
                            <div className="flex-1 truncate">{agent.name}</div>
                          </div>
                        ))
                      }
                      
                      {Object.values(agentData.agents).filter(agent => agent.level === level).length > 3 && (
                        <div className="flex items-center ml-3 text-sm text-muted-foreground">
                          <CaretRight className="h-4 w-4 mr-1" />
                          {Object.values(agentData.agents).filter(agent => agent.level === level).length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Performance Review Dialog */}
      {selectedAgent && (
        <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Performance Review: {selectedAgent.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="efficiency">Efficiency</Label>
                  <div className="flex items-center mt-1">
                    <Input
                      id="efficiency"
                      type="number"
                      min="0"
                      max="100"
                      value={reviewData.efficiency}
                      onChange={(e) => setReviewData({...reviewData, efficiency: parseInt(e.target.value) || 0})}
                      className="w-16"
                    />
                    <span className="ml-1">%</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="accuracy">Accuracy</Label>
                  <div className="flex items-center mt-1">
                    <Input
                      id="accuracy"
                      type="number"
                      min="0"
                      max="100"
                      value={reviewData.accuracy}
                      onChange={(e) => setReviewData({...reviewData, accuracy: parseInt(e.target.value) || 0})}
                      className="w-16"
                    />
                    <span className="ml-1">%</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="satisfaction">Satisfaction</Label>
                  <div className="flex items-center mt-1">
                    <Input
                      id="satisfaction"
                      type="number"
                      min="0"
                      max="100"
                      value={reviewData.satisfaction}
                      onChange={(e) => setReviewData({...reviewData, satisfaction: parseInt(e.target.value) || 0})}
                      className="w-16"
                    />
                    <span className="ml-1">%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Review Notes</Label>
                <Textarea
                  id="notes"
                  value={reviewData.notes}
                  onChange={(e) => setReviewData({...reviewData, notes: e.target.value})}
                  placeholder="Enter performance observations and notes"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Recommended Action</Label>
                <RadioGroup
                  value={reviewData.action}
                  onValueChange={(value) => setReviewData({...reviewData, action: value})}
                  className="flex flex-col space-y-2 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maintain" id="maintain" />
                    <Label htmlFor="maintain">Maintain current role</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="promote" id="promote" 
                      disabled={selectedAgent.level >= 5} />
                    <Label htmlFor="promote" className={selectedAgent.level >= 5 ? 'text-muted-foreground' : ''}>
                      Promote to next level {selectedAgent.level >= 5 ? '(max level reached)' : ''}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transfer" id="transfer" />
                    <Label htmlFor="transfer">Transfer to different role</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setReviewModalOpen(false)}>Cancel</Button>
              <Button onClick={handleReviewSubmit}>Complete Review</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}