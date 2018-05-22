importScripts('//d3js.org/d3.v4.js');

// const domain = window.location.protocol + '//' + window.location.host

onmessage = (e) => {
  const nodes = e.data.nodes;
  const links = e.data.links;

  // Add force simulation
  const simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-80))
    .force('link', d3.forceLink(links)
      .distance(40)
      .id((d) => {
        return d.id;
      }))
    .force('collide', d3.forceCollide().radius(10))
    .force('x', d3.forceX())
    .force('y', d3.forceY())
    .stop();

  // Tick messages
  for (let i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) /
    Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
    postMessage({ type: "tick", progress: i / n });
    simulation.tick();
  }

  postMessage({ type: "end", nodes, links });
};
