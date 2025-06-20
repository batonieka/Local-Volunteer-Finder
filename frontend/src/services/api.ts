export const fetchOpportunities = async (id: string) => {
    const res = await fetch('/opportunities');
    return res.json();
};
