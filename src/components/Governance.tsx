import { useState } from 'react'
import { AgentDataStore } from '../data/initialData'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, Shield, AlertOctagon, ClipboardCheck, Target } from "@phosphor-icons/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface GovernanceProps {
  agentData: AgentDataStore
  updateAgentData: (data: AgentDataStore) => void
}

export function Governance({ agentData, updateAgentData }: GovernanceProps) {
  const [searchQuery, setSearchQuery] = useState('')
  
  // List of possible permissions in the system
  const allPermissions = [
    { id: 'full_access', name: 'Full System Access', description: 'Complete unrestricted access to all system functions', risk: 'high' },
    { id: 'hiring', name: 'Agent Hiring', description: 'Create and onboard new agents', risk: 'medium' },
    { id: 'strategy', name: 'Strategic Planning', description: 'Define organization objectives and strategy', risk: 'high' },
    { id: 'compliance_override', name: 'Compliance Override', description: 'Override compliance restrictions in exceptional cases', risk: 'high' },
    { id: 'operations_access', name: 'Operations Access', description: 'Access to operational systems and workflows', risk: 'medium' },
    { id: 'task_assignment', name: 'Task Assignment', description: 'Assign and delegate tasks to other agents', risk: 'low' },
    { id: 'reporting', name: 'Reporting', description: 'Generate and access system reports', risk: 'low' },
    { id: 'audit_access', name: 'Audit Access', description: 'Access audit records and logs', risk: 'medium' },
    { id: 'compliance_monitoring', name: 'Compliance Monitoring', description: 'Monitor system for compliance violations', risk: 'medium' },
    { id: 'policy_enforcement', name: 'Policy Enforcement', description: 'Enforce compliance policies', risk: 'medium' },
    { id: 'audit_execution', name: 'Audit Execution', description: 'Conduct compliance audits', risk: 'medium' },
    { id: 'documentation_access', name: 'Documentation Access', description: 'Access system documentation', risk: 'low' },
    { id: 'development_access', name: 'Development Access', description: 'Access agent development tools', risk: 'medium' },
    { id: 'training_assignment', name: 'Training Assignment', description: 'Assign training to agents', risk: 'low' },
    { id: 'capability_management', name: 'Capability Management', description: 'Manage agent capabilities', risk: 'medium' },
    { id: 'resource_management', name: 'Resource Management', description: 'Manage and allocate system resources', risk: 'medium' },
    { id: 'allocation_authority', name: 'Allocation Authority', description: 'Authority to allocate resources to agents', risk: 'medium' },
    { id: 'training_design', name: 'Training Design', description: 'Design training programs for agents', risk: 'low' },
    { id: 'assessment_tools', name: 'Assessment Tools', description: 'Access to capability assessment tools', risk: 'low' },
    { id: 'performance_monitoring', name: 'Performance Monitoring', description: 'Monitor agent performance metrics', risk: 'low' },
    { id: 'evaluation_tools', name: 'Evaluation Tools', description: 'Access to agent evaluation tools', risk: 'low' },
    { id: 'task_execution', name: 'Task Execution', description: 'Execute assigned tasks', risk: 'low' },
    { id: 'basic_reporting', name: 'Basic Reporting', description: 'Generate basic activity reports', risk: 'low' },
    { id: 'basic_access', name: 'Basic Access', description: 'Basic system access', risk: 'low' },
  ]
  
  // Update agent permissions
  const updateAgentPermissions = (agentId: string, permissionId: string, isChecked: boolean) => {
    const agent = agentData.agents[agentId]
    if (!agent) return
    
    let updatedPermissions = [...agent.permissions]
    
    if (isChecked) {
      // Add permission if it doesn't exist
      if (!updatedPermissions.includes(permissionId)) {
        updatedPermissions.push(permissionId)
      }
    } else {
      // Remove permission
      updatedPermissions = updatedPermissions.filter(p => p !== permissionId)
    }
    
    // Update agent data
    const updatedAgents = {
      ...agentData.agents,
      [agentId]: {
        ...agent,
        permissions: updatedPermissions,
        history: [
          ...agent.history,
          {
            date: new Date().toLocaleDateString('en-US'),
            event: isChecked ? "permission_added" : "permission_removed",
            details: `${isChecked ? 'Added' : 'Removed'} permission: ${permissionId}`
          }
        ]
      }
    }
    
    updateAgentData({
      ...agentData,
      agents: updatedAgents
    })
  }

  // Filter agents by search query
  const filteredAgents = Object.values(agentData.agents)
    .filter(agent => 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      agent.role.toLowerCase().includes(searchQuery.toLowerCase())
    )

  // Create audit log from agent history
  const auditLog = Object.values(agentData.agents)
    .flatMap(agent => 
      agent.history.map(event => ({
        agentId: agent.id,
        agentName: agent.name,
        ...event
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  // Get risk rating for an agent based on permissions
  const getAgentRiskRating = (permissions: string[]) => {
    if (permissions.includes('full_access') || permissions.includes('compliance_override')) return 'high'
    if (permissions.some(p => allPermissions.find(ap => ap.id === p)?.risk === 'high')) return 'high'
    if (permissions.some(p => allPermissions.find(ap => ap.id === p)?.risk === 'medium')) return 'medium'
    return 'low'
  }
  
  // Generate compliance score
  const generateComplianceScore = () => {
    // A real system would have more sophisticated compliance scoring
    const highRiskAgents = Object.values(agentData.agents)
      .filter(agent => getAgentRiskRating(agent.permissions) === 'high').length
    
    const totalAgents = Object.values(agentData.agents).length
    const overridePermissions = Object.values(agentData.agents)
      .filter(agent => agent.permissions.includes('compliance_override')).length
    
    // Score decreases with more high-risk agents and override permissions
    return Math.max(60, 100 - (highRiskAgents * 5) - (overridePermissions * 10))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Governance & Compliance</h3>
        <p className="text-sm text-muted-foreground">Manage permissions and ensure compliance across your agent workforce</p>
      </div>
      
      <Tabs defaultValue="permissions">
        <TabsList className="mb-4">
          <TabsTrigger value="permissions">Permissions Matrix</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="permissions">
          <div className="space-y-4">
            {/* Search and filter */}
            <div className="flex items-center w-full max-w-sm relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 py-2 pr-4 w-full rounded-md border border-input bg-background text-sm"
              />
            </div>
            
            {/* Permissions matrix table */}
            <div className="border rounded-md overflow-auto">
              <Table>
                <TableHeader className="bg-secondary sticky top-0">
                  <TableRow>
                    <TableHead className="sticky left-0 bg-secondary w-[250px]">Agent / Permission</TableHead>
                    {allPermissions.map(permission => (
                      <TableHead 
                        key={permission.id}
                        className="text-center whitespace-nowrap px-2"
                        title={permission.description}
                      >
                        <div className="flex flex-col items-center">
                          <span>{permission.name}</span>
                          <Badge variant={permission.risk === 'high' ? 'destructive' : permission.risk === 'medium' ? 'secondary' : 'outline'} className="mt-1">
                            {permission.risk}
                          </Badge>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={allPermissions.length + 1} className="text-center py-4 text-muted-foreground">
                        No agents found matching your search
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAgents.map(agent => (
                      <TableRow key={agent.id}>
                        <TableCell className="sticky left-0 bg-background font-medium">
                          <div>{agent.name}</div>
                          <div className="text-xs text-muted-foreground">{agent.role}</div>
                        </TableCell>
                        {allPermissions.map(permission => (
                          <TableCell key={`${agent.id}-${permission.id}`} className="text-center">
                            <Checkbox
                              checked={agent.permissions.includes(permission.id)}
                              onCheckedChange={(checked) => 
                                updateAgentPermissions(agent.id, permission.id, !!checked)
                              }
                              aria-label={`${permission.name} for ${agent.name}`}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="compliance">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Compliance Score */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center pt-4">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-32 h-32">
                      <circle
                        className="text-secondary"
                        strokeWidth="6"
                        stroke="currentColor"
                        fill="transparent"
                        r="56"
                        cx="64"
                        cy="64"
                      />
                      <circle
                        className={`${generateComplianceScore() > 80 ? 'text-green-500' : 
                          generateComplianceScore() > 60 ? 'text-amber-500' : 'text-destructive'}`}
                        strokeWidth="6"
                        strokeDasharray={360}
                        strokeDashoffset={360 - ((generateComplianceScore() / 100) * 360)}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="56"
                        cx="64"
                        cy="64"
                        style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
                      />
                    </svg>
                    <span className="absolute text-3xl font-bold">{generateComplianceScore()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Based on risk profile and permission allocation</p>
                </div>
                
                <div className="space-y-2 mt-6">
                  <div className="flex justify-between text-sm">
                    <span>High Risk Agents</span>
                    <span className="font-medium">
                      {Object.values(agentData.agents).filter(agent => 
                        getAgentRiskRating(agent.permissions) === 'high'
                      ).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Override Permissions</span>
                    <span className="font-medium">
                      {Object.values(agentData.agents).filter(agent => 
                        agent.permissions.includes('compliance_override')
                      ).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Risk Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 pt-4">
                  {['high', 'medium', 'low'].map((risk) => {
                    const agentCount = Object.values(agentData.agents).filter(agent => 
                      getAgentRiskRating(agent.permissions) === risk
                    ).length
                    const percentage = Math.round((agentCount / Object.values(agentData.agents).length) * 100) || 0
                    
                    return (
                      <div key={risk} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{risk} Risk</span>
                          <span>{agentCount} agents ({percentage}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              risk === 'high' ? 'bg-destructive' : 
                              risk === 'medium' ? 'bg-amber-500' : 
                              'bg-green-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                <div className="bg-muted p-3 rounded-md mt-6">
                  <div className="flex items-start">
                    <AlertOctagon className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Recommendations</p>
                      <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc pl-4">
                        <li>Review high risk agents and minimize override permissions</li>
                        <li>Implement principle of least privilege for all agents</li>
                        <li>Regularly audit permission changes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Compliance Policies */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Compliance Policies</CardTitle>
                <CardDescription>Active governance controls</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Least Privilege Policy</span>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-700 hover:bg-green-500/10">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ClipboardCheck className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Permission Auditing</span>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-700 hover:bg-green-500/10">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-2 text-amber-500" />
                      <span className="text-sm">Override Controls</span>
                    </div>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/10">Review</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertOctagon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Risk-Based Approvals</span>
                    </div>
                    <Badge variant="outline">Inactive</Badge>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-6">
                  Manage Policies
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="audit">
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Audit Events</h3>
              <Button variant="outline" size="sm">Export Log</Button>
            </div>
            
            <div className="space-y-4">
              {auditLog.slice(0, 20).map((entry, index) => (
                <div key={index} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{entry.agentName} ({entry.agentId})</p>
                      <p className="text-sm">{entry.details}</p>
                    </div>
                    <div className="text-sm text-right text-muted-foreground whitespace-nowrap">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="text-xs">
                      {entry.event}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            {auditLog.length > 20 && (
              <div className="flex justify-center">
                <Button variant="outline" size="sm">Load More</Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}