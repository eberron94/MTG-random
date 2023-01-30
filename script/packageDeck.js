const axios = require('axios');
const cheerio = require('cheerio');

const getPostTitles = async () => {
	try {
		const { data } = await axios.get(
			'https://cubecobra.com/cube/list/1v1edh?s2=Unsorted'
		);
		
		const $ = cheerio.load(data);
		const postTitles = [];

		console.log($('body'))

		$('.table-col').each((_idx, el) => {
			console.log(_idx)
			const postTitle = $(el).text()
			postTitles.push(postTitle)
		});

		return postTitles;
	} catch (error) {
		throw error;
	}
};

getPostTitles()
    .then((postTitles) => console.log(postTitles));