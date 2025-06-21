import { AgentDataStore } from "../data/initialData"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Robot, Clock, Lightning, Target } from "@phosphor-icons/react"
import { Progress } from "@/components/ui/progress"

interface DashboardProps {
  agentData: AgentDataStore
}

export function Dashboard({ agentData }: DashboardProps) {
  // Calculate percentages of agent statuses
  const totalAgents = Object.keys(agentData.agents).length
  const activeAgents = Object.values(agentData.agents).filter(agent => agent.status === 'active').length
  const onboardingAgents = Object.values(agentData.agents).filter(agent => agent.status === 'onboarding').length
  const reviewAgents = Object.values(agentData.agents).filter(agent => agent.status === 'review').length
  
  // Calculate top performing agents
  const topAgents = Object.values(agentData.agents)
    .filter(agent => agent.status === 'active')
    .map(agent => ({
      ...agent,
      averagePerformance: (agent.performance.efficiency + agent.performance.accuracy + agent.performance.satisfaction) / 3
    }))
    .sort((a, b) => b.averagePerformance - a.averagePerformance)
    .slice(0, 3)
  
  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Agents"
          value={totalAgents}
          description="Total agents in organization"
          icon={Robot}
          trend={{ value: 2, isPositive: true }}
        />
        <MetricCard 
          title="Active Agents"
          value={activeAgents}
          description={`${Math.round((activeAgents / totalAgents) * 100)}% of total agents`}
          icon={Lightning}
          trend={{ value: 1, isPositive: true }}
        />
        <MetricCard 
          title="Onboarding"
          value={onboardingAgents}
          description={`${Math.round((onboardingAgents / totalAgents) * 100)}% of total agents`}
          icon={Clock}
          trend={{ value: 0, isNeutral: true }}
        />
        <MetricCard 
          title="In Review"
          value={reviewAgents}
          description={`${Math.round((reviewAgents / totalAgents) * 100)}% of total agents`}
          icon={Target}
          trend={{ value: 1, isPositive: false }}
        />
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Efficiency */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{agentData.metrics.efficiency_avg.toFixed(1)}%</span>
              <div className="flex items-center text-sm font-medium text-green-500">
                <ArrowUp className="mr-1 h-4 w-4" />
                2.5%
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={agentData.metrics.efficiency_avg} className="h-2" />
          </CardContent>
        </Card>

        {/* Accuracy */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{agentData.metrics.accuracy_avg.toFixed(1)}%</span>
              <div className="flex items-center text-sm font-medium text-green-500">
                <ArrowUp className="mr-1 h-4 w-4" />
                1.3%
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={agentData.metrics.accuracy_avg} className="h-2" />
          </CardContent>
        </Card>

        {/* Satisfaction */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{agentData.metrics.satisfaction_avg.toFixed(1)}%</span>
              <div className="flex items-center text-sm font-medium text-red-500">
                <ArrowDown className="mr-1 h-4 w-4" />
                0.8%
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={agentData.metrics.satisfaction_avg} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Agents</CardTitle>
            <CardDescription>Based on efficiency, accuracy, and satisfaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topAgents.map(agent => (
                <div key={agent.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <Robot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-24 bg-secondary mr-3 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${agent.averagePerformance}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{agent.averagePerformance.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest events in your agent workforce</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.values(agentData.agents)
                .flatMap(agent => 
                  agent.history.map(h => ({ 
                    agentId: agent.id, 
                    agentName: agent.name, 
                    ...h 
                  }))
                )
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((activity, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                      {activity.event.includes('onboard') && <Robot className="h-4 w-4" />}
                      {activity.event.includes('review') && <Target className="h-4 w-4" />}
                      {!activity.event.includes('onboard') && !activity.event.includes('review') && <Clock className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{activity.agentName}</span> - {activity.details}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: number
  description: string
  icon: React.FC<{ className?: string }>
  trend: {
    value: number
    isPositive?: boolean
    isNeutral?: boolean
  }
}

function MetricCard({ title, value, description, icon: Icon, trend }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {!trend.isNeutral && (
          <div className={`flex items-center text-xs mt-2 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isPositive ? <ArrowUp className="mr-1 h-3.5 w-3.5" /> : <ArrowDown className="mr-1 h-3.5 w-3.5" />}
            <span>{trend.value} {trend.value === 1 ? 'agent' : 'agents'} {trend.isPositive ? 'added' : 'removed'}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}