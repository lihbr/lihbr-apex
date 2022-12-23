const escapeHTML = require("escape-html");
const { asText } = require("@prismicio/client");

const { logErrors } = require("../../dist/helpers/index.cjs");
const globalComputed = require("../../data/eleventyComputed.cjs");

module.exports = {
	eleventyComputed: {
		...globalComputed,
		meta: logErrors((data) => {
			const meta = globalComputed.meta(data);
			const { doc } = data;

			meta.structuredData = JSON.stringify([
				...JSON.parse(meta.structuredData || "[]"),
				{
					"@context": "http://schema.org",
					"@type": "BlogPosting",

					"mainEntityOfPage": {
						"@type": "WebSite",
						"@id": escapeHTML(meta.site.url),
					},

					"url": escapeHTML(meta.url),
					"name": escapeHTML(asText(doc.data.title)),
					"alternateName": escapeHTML(meta.site.name),
					"headline": escapeHTML(asText(doc.data.title)),
					"image": escapeHTML(meta.image.openGraph),
					"description": escapeHTML(doc.data.lead_text),
					"datePublished": escapeHTML(doc.data.published_date),
					"dateModified": escapeHTML(doc.data.published_date),

					"author": {
						"@type": "Person",
						"name": escapeHTML(meta.site.mainAuthor),
					},

					"publisher": {
						"@type": "Organization",
						"url": escapeHTML(meta.site.url),
						"logo": {
							"@type": "ImageObject",
							"url": escapeHTML(meta.site.image.openGraph),
						},
						"name": escapeHTML(meta.site.name),
					},
				},
			]);

			return meta;
		}),
	},
};
