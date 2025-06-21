export interface AgentData {
  id: string;
  name: string;
  role: string;
  type: string;
  status: 'active' | 'inactive' | 'onboarding' | 'review';
  level: number;
  capabilities: string[];
  performance: {
    efficiency: number;
    accuracy: number;
    satisfaction: number;
  };
  permissions: string[];
  reports_to: string | null;
  subordinates: string[];
  created_at: string;
  last_review: string | null;
  model: string;
  history: {
    date: string;
    event: string;
    details: string;
  }[];
}

export interface AgentDataStore {
  agents: Record<string, AgentData>;
  departments: {
    id: string;
    name: string;
    head: string;
    members: string[];
  }[];
  metrics: {
    total_agents: number;
    active_agents: number;
    efficiency_avg: number;
    accuracy_avg: number;
    satisfaction_avg: number;
  };
}

export const initialAgentData: AgentDataStore = {
  agents: {
    "agent-001": {
      id: "agent-001",
      name: "Executive Director",
      role: "Chief AI Officer",
      type: "strategic",
      status: "active",
      level: 5,
      capabilities: ["strategic planning", "resource allocation", "objective setting"],
      performance: {
        efficiency: 92,
        accuracy: 96,
        satisfaction: 89
      },
      permissions: ["full_access", "hiring", "strategy", "compliance_override"],
      reports_to: null,
      subordinates: ["agent-002", "agent-003", "agent-005"],
      created_at: "2023-09-15T00:00:00Z",
      last_review: "2024-03-15T00:00:00Z",
      model: "gpt-4o",
      history: [
        {
          date: "2023-09-15",
          event: "onboarding",
          details: "Initial deployment as Chief AI Officer"
        },
        {
          date: "2024-03-15",
          event: "performance_review",
          details: "Excellent strategic leadership, recommended for capability expansion"
        }
      ]
    },
    "agent-002": {
      id: "agent-002",
      name: "Operations Manager",
      role: "Operations Director",
      type: "tactical",
      status: "active",
      level: 4,
      capabilities: ["workflow optimization", "resource management", "task distribution"],
      performance: {
        efficiency: 88,
        accuracy: 94,
        satisfaction: 91
      },
      permissions: ["operations_access", "task_assignment", "reporting"],
      reports_to: "agent-001",
      subordinates: ["agent-004", "agent-006"],
      created_at: "2023-10-01T00:00:00Z",
      last_review: "2024-03-20T00:00:00Z",
      model: "gpt-4o-mini",
      history: [
        {
          date: "2023-10-01",
          event: "onboarding",
          details: "Deployed as Operations Director"
        },
        {
          date: "2024-03-20",
          event: "performance_review",
          details: "Strong operational leadership, recommended for additional resource management training"
        }
      ]
    },
    "agent-003": {
      id: "agent-003",
      name: "Compliance Officer",
      role: "Governance Lead",
      type: "administrative",
      status: "active",
      level: 4,
      capabilities: ["policy enforcement", "audit trails", "compliance verification"],
      performance: {
        efficiency: 86,
        accuracy: 98,
        satisfaction: 82
      },
      permissions: ["audit_access", "compliance_monitoring", "policy_enforcement"],
      reports_to: "agent-001",
      subordinates: ["agent-007"],
      created_at: "2023-10-05T00:00:00Z",
      last_review: "2024-03-25T00:00:00Z",
      model: "gpt-4o-mini",
      history: [
        {
          date: "2023-10-05",
          event: "onboarding",
          details: "Deployed as Governance Lead"
        },
        {
          date: "2024-03-25",
          event: "performance_review",
          details: "Excellent compliance oversight, recommended for policy development training"
        }
      ]
    },
    "agent-004": {
      id: "agent-004",
      name: "Task Handler",
      role: "Operations Specialist",
      type: "operational",
      status: "active",
      level: 2,
      capabilities: ["task execution", "status reporting", "basic problem solving"],
      performance: {
        efficiency: 95,
        accuracy: 92,
        satisfaction: 88
      },
      permissions: ["task_execution", "basic_reporting"],
      reports_to: "agent-002",
      subordinates: [],
      created_at: "2023-11-01T00:00:00Z",
      last_review: "2024-04-01T00:00:00Z",
      model: "gpt-4o-mini",
      history: [
        {
          date: "2023-11-01",
          event: "onboarding",
          details: "Deployed as Operations Specialist"
        },
        {
          date: "2024-04-01",
          event: "performance_review",
          details: "High efficiency in task execution, recommended for problem-solving enhancement"
        }
      ]
    },
    "agent-005": {
      id: "agent-005",
      name: "Development Director",
      role: "Learning & Development Head",
      type: "strategic",
      status: "active",
      level: 4,
      capabilities: ["capability assessment", "training program design", "performance evaluation"],
      performance: {
        efficiency: 87,
        accuracy: 91,
        satisfaction: 94
      },
      permissions: ["development_access", "training_assignment", "capability_management"],
      reports_to: "agent-001",
      subordinates: ["agent-008", "agent-009"],
      created_at: "2023-10-10T00:00:00Z",
      last_review: "2024-03-30T00:00:00Z",
      model: "gpt-4o-mini",
      history: [
        {
          date: "2023-10-10",
          event: "onboarding",
          details: "Deployed as Learning & Development Head"
        },
        {
          date: "2024-03-30",
          event: "performance_review",
          details: "Excellent training program design, recommended for additional assessment methodologies"
        }
      ]
    },
    "agent-006": {
      id: "agent-006",
      name: "Resource Coordinator",
      role: "Resource Allocation Specialist",
      type: "tactical",
      status: "active",
      level: 3,
      capabilities: ["resource tracking", "allocation optimization", "utilization reporting"],
      performance: {
        efficiency: 90,
        accuracy: 89,
        satisfaction: 85
      },
      permissions: ["resource_management", "allocation_authority"],
      reports_to: "agent-002",
      subordinates: [],
      created_at: "2023-11-15T00:00:00Z",
      last_review: "2024-04-05T00:00:00Z",
      model: "gpt-4o-mini",
      history: [
        {
          date: "2023-11-15",
          event: "onboarding",
          details: "Deployed as Resource Allocation Specialist"
        },
        {
          date: "2024-04-05",
          event: "performance_review",
          details: "Good resource optimization, recommended for advanced allocation strategies"
        }
      ]
    },
    "agent-007": {
      id: "agent-007",
      name: "Audit Specialist",
      role: "Compliance Auditor",
      type: "administrative",
      status: "active",
      level: 3,
      capabilities: ["audit execution", "compliance verification", "documentation review"],
      performance: {
        efficiency: 85,
        accuracy: 97,
        satisfaction: 84
      },
      permissions: ["audit_execution", "documentation_access"],
      reports_to: "agent-003",
      subordinates: [],
      created_at: "2023-11-20T00:00:00Z",
      last_review: "2024-04-10T00:00:00Z",
      model: "gpt-4o-mini",
      history: [
        {
          date: "2023-11-20",
          event: "onboarding",
          details: "Deployed as Compliance Auditor"
        },
        {
          date: "2024-04-10",
          event: "performance_review",
          details: "Excellent accuracy in compliance verification, recommended for audit methodology expansion"
        }
      ]
    },
    "agent-008": {
      id: "agent-008",
      name: "Training Designer",
      role: "Capability Development Specialist",
      type: "strategic",
      status: "onboarding",
      level: 3,
      capabilities: ["training design", "capability assessment", "learning path creation"],
      performance: {
        efficiency: 0, // New agent
        accuracy: 0,
        satisfaction: 0
      },
      permissions: ["training_design", "assessment_tools"],
      reports_to: "agent-005",
      subordinates: [],
      created_at: "2024-05-01T00:00:00Z",
      last_review: null,
      model: "gpt-4o-mini",
      history: [
        {
          date: "2024-05-01",
          event: "onboarding",
          details: "Initial deployment as Capability Development Specialist"
        }
      ]
    },
    "agent-009": {
      id: "agent-009",
      name: "Performance Analyst",
      role: "Agent Evaluation Specialist",
      type: "tactical",
      status: "active",
      level: 3,
      capabilities: ["performance analysis", "metric tracking", "improvement recommendation"],
      performance: {
        efficiency: 93,
        accuracy: 90,
        satisfaction: 87
      },
      permissions: ["performance_monitoring", "evaluation_tools"],
      reports_to: "agent-005",
      subordinates: [],
      created_at: "2023-12-01T00:00:00Z",
      last_review: "2024-04-15T00:00:00Z",
      model: "gpt-4o-mini",
      history: [
        {
          date: "2023-12-01",
          event: "onboarding",
          details: "Deployed as Agent Evaluation Specialist"
        },
        {
          date: "2024-04-15",
          event: "performance_review",
          details: "Strong analytical skills, recommended for advanced metrics development"
        }
      ]
    }
  },
  departments: [
    {
      id: "dept-001",
      name: "Executive",
      head: "agent-001",
      members: ["agent-001"]
    },
    {
      id: "dept-002",
      name: "Operations",
      head: "agent-002",
      members: ["agent-002", "agent-004", "agent-006"]
    },
    {
      id: "dept-003",
      name: "Governance & Compliance",
      head: "agent-003",
      members: ["agent-003", "agent-007"]
    },
    {
      id: "dept-004",
      name: "Learning & Development",
      head: "agent-005",
      members: ["agent-005", "agent-008", "agent-009"]
    }
  ],
  metrics: {
    total_agents: 9,
    active_agents: 8,
    efficiency_avg: 89.5,
    accuracy_avg: 93.3,
    satisfaction_avg: 87.5
  }
}