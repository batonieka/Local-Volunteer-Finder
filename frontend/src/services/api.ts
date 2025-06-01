export const fetchOpportunities = async () => {
    const res = await fetch('/opportunities');
    return res.json();
};
