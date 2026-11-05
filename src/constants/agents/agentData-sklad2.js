import AgentImg from "@/assets/agents/agent-img.png";



const agents = [
    //  Nodirbek
    {
        id:"Нодирбек",
        name:"Нодирбек",
        fulName: "Нодирбек Кадиржан угли",
        img: AgentImg ,
        phone: "+996 553 010 675",
        phoneUrl : "tel:+996553010675",
        region : "Джалал-Абад , Ноокат",
        currency:"сом",
        monthlySales: 0,
        monthlyCollected: 0,
        totalDebt: 0,
        rol: "agent"
    },
    // Ali
    {
        id:"Али",
        name:"Али",
        fulName: "Арипов Али",
        img: AgentImg ,
        phone: "+996 557 588 831",
        phoneUrl : "tel:+996557588831",
        region : "Озгон , Кара-Суу",
        currency:"сом",
        monthlySales: 0,
        monthlyCollected: 0,
        totalDebt: 0,
        rol: "agent"
    },
    // Vohidjon
    {
        id:"Вохиджон",
        name:"Вохиджон",
        fulName: "Вохиджон  Арипов",
        img: AgentImg ,
        phone: "+996 700 292 906",
        phoneUrl : "tel:+996700292906",
        region : "Ош",
        currency:"сом",
        monthlySales: 0,
        monthlyCollected: 0,
        totalDebt: 0,
        rol: "agent"
    },
    // Umidjon
    {
        id:"Умиджон",
        name:"Умиджон",
        fulName: "Умиджон Мамажанов",
        img: AgentImg ,
        phone: "+996 557 110 046",
        phoneUrl : "tel:+996557110046",
        region : "Кызыл-Кия , Кадамжай",
        currency:"сом",
        monthlySales: 0,
        monthlyCollected: 0,
        totalDebt: 0,
        rol: "agent"
    },
    // Zuxriddin
    {
        id:"Зухриддин",
        name:"Зухриддин",
        fulName: "Зухриддин Маҳаммаджанов",
        img: AgentImg ,
        phone: "+996 708 161 023",
        phoneUrl : "tel:+996708161023",
        region : "Ош , Араван",
        currency:"сом",
        monthlySales: 0,
        monthlyCollected: 0,
        totalDebt: 0,
        rol: "agent"
    },
    // Sherzodbek
    {
        id:"Шерзодбек",
        name:"Шерзодбек",
        fulName: "Турсунов Шерзодбек",
        img: AgentImg ,
        phone: "+996 558 745 858",
        phoneUrl : "tel:+996558745858",
        region : "Ош",
        currency:"сом",
        monthlySales: 0,
        monthlyCollected: 0,
        totalDebt: 0,
        rol: "manager"
    },
    // Bahtiyor aka 
    {
        id:"Бахтиёр",
        name:"Бахтиёр",
        fulName: "Бахтиёр ака(Джалал-Абад)",
        img: AgentImg ,
        phone: "+996 550 371 792",
        phoneUrl : "tel:+996550371792",
        region : "Джалал-Абад",
        currency:"сом",
        monthlySales: 0,
        monthlyCollected: 0,
        totalDebt: 0,
        rol: "agent"
    },
    //  Soyibjon aka 
    {
        id:"Сойибжон",
        name:"Сойибжон",
        fulName: "Сойибжон ака(Джалал-Абад)",
        img: AgentImg ,
        phone: "+996 550 371 792",
        phoneUrl : "tel:+996550371792",
        region : "Джалал-Абад",
        currency:"сом",
        monthlySales: 0,
        monthlyCollected: 0,
        totalDebt: 0,
        rol: "agent"
    },
    //  Holmuhammada aka 
    {
        id:"Холмухаммад",
        name:"Холмухаммад",
        fulName: "Холмухаммад ака",
        img: AgentImg ,
        phone: "+996 550 434 510",
        phoneUrl : "tel:+996550434510",
        region : "Кыргызстан",
        currency:"сом",
        monthlySales: 0,
        monthlyCollected: 0,
        totalDebt: 0,
        rol: "manager"
    },
    //   Cklad kalelin kalhoz
    {
        id:"Перемещение",
        name:"Перемещение",
        fulName: "Перемещение cклад ",
        img: AgentImg ,
        phone: "",
        phoneUrl : "",
        region : "Склад каленин колхоз",
        currency:"сом",
        monthlySales: 0,
        monthlyCollected: 0,
        totalDebt: 0,
        rol: "agent"
    },


]


const sortAgentsByDebt = (agents) => {
    return [...agents].sort((a, b) => b.totalDebt - a.totalDebt);
};


export const dataAgentsSklad2 = sortAgentsByDebt(agents)