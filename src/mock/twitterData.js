export function mockTwitterData() {
  return [
    {
      id: '1',
      text: 'Just tried the new product, absolutely love it! #amazing',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      text: 'Customer service was terrible today. Very disappointed.',
      timestamp: new Date().toISOString()
    },
    {
      id: '3',
      text: 'Neutral statement about the weather today.',
      timestamp: new Date().toISOString()
    }
  ];
}