import './style.css'
import * as d3 from 'd3'

let app_root = d3.select('#app')
const { width, height } = app_root.node().getBoundingClientRect()
console.log({width},{height})
d3.csv('Stations.csv', ({Name, Url, Homepage, Tags, Favicon, CountryCode, Votes}) => ({
	Name: Name
, Url: Url
, Homepage: Homepage
, Tags: Tags
, Favicon: Favicon
, CountryCode: CountryCode
, Votes: parseInt(Votes)
})).then( d => {
	let cn_stations = d.filter(x => x.CountryCode === 'CN' && x.Votes && x.Tags && x.Favicon)
	console.log(cn_stations)
	const pack = d3.pack()
		.size([width, height])
		.padding(3)
	const hierarchy = d3.hierarchy({ children: cn_stations.sort((a, b) => b.Votes - a.Votes) }).sum(o => o.Votes ** .6)
	const packed_circles = pack(hierarchy)

	let selection = app_root.append('svg').selectAll('circle').data(packed_circles.leaves()).enter().append('a')
		.attr('transform', o => `translate(${o.x}, ${o.y})`)
		.on('click', (e,o) => {
			e.preventDefault()
			d3.select('audio').attr('src', o.data.Url).node().play()
			d3.select('figcaption').text(o.data.Name)
		})
		.each(function(d) {
			let images = d3.select(this).append('image')
				.attr('href', d.data.Favicon)
				.attr('width', d.r * 2)
				.attr('height', d.r * 2)
				.attr('x', -d.r)
				.attr('y', -d.r)
				.style('clip-path', `circle(${d.r / 2}px at center)`)
				.lower()
			let cirlces = d3.select(this).append('circle')
				.attr('r', d.r)
				.lower()
		})
	console.log(packed_circles.leaves())
})
