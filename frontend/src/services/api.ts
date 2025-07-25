const BASE_URL = 'http://localhost:3000';

export const fetchOpportunities = async () => {
  const res = await fetch(`${BASE_URL}/opportunities`);
  return res.json();
};

export const fetchOpportunityById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/opportunities/${id}`);
  if (!res.ok) throw new Error('Failed to fetch opportunity');
  return res.json();
};


//this is not used anywhere rn but i decided to keep in case i might need it later. ive converted all uses to hooks and usefetch:)