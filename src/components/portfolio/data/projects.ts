export interface Project {
  id: string;
  title: string;
  role: string;
  description: string;
  image: string;
}

export const projectsData: Project[] = [
  {
    id: "p1",
    title: "VELOCITY-GEAR",
    role: "eCommerce de Impresión bajo Demanda",
    description: "Designing the interface for brain-to-machine data streaming with real-time feedback loops.",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "p2",
    title: "EON PROTOCOL",
    role: "Lead Product Designer",
    description: "Decentralized autonomous infrastructure visualizing complex sub-networks and nodal health.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "p3",
    title: "SYNTHESIS",
    role: "Creative Developer",
    description: "Algorithmic soundscapes generated from user biometric inputs, rendered in WebGL.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "p4",
    title: "VOID RUNNER",
    role: "Interactive Developer",
    description: "A gamified productivity suite leveraging game physics to prioritize task completion.",
    image: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "p5",
    title: "CYBER METRICS",
    role: "Data Visualization",
    description: "Global threat intelligence dashboard with predictive modeling and real-time alerts.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop"
  }
];
