importScripts('//d3js.org/d3.v4.js');

// const domain = window.location.protocol + '//' + window.location.host

onmessage = (e) => {
  const nodes = e.data.nodes;
  const links = e.data.links;

  // Add force simulation
      const simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-200).distanceMax(200))
        .force("link", d3.forceLink(links).distance((d) => d.target.isSuggestion ? 100 : 200).strength((d) => d.target.isSuggestion ? .8 : 0.5))
        .force("y", d3.forceY((d) => 100).strength(d => d.isSuggestion ? 0 : .5))// d.isSuggestion? d.y: 0))
        .force("x", d3.forceX((d) => d.x).strength(d => d.isSuggestion ? 0 : .5))
        .force('collide', d3.forceCollide().radius(10))
        .stop();


  // Tick messages
  for (let i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) /
    Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
    postMessage({ type: "tick", progress: i / n });
    simulation.tick();
  }

  postMessage({ type: "end", nodes, links });
};
