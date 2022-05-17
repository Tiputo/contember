import { SchemaDefinition as def } from '@contember/schema-definition'
import { Article } from './Article'
import { Button } from './Button'
import { Content } from './Content'
import { Image } from './Image'
import { Page } from './Page'
import {TestimonialAuthor, Testimonial} from "./Testimonial"

export const ContentBlockType = def.createEnum(
	'heroSection', // primaryText, content, images, buttons
	'logosSection', // jsonContent, images
	'contentSection', // primaryText, content
	'featureSection', // primaryText, secondaryText, content, featureList
	'ctaSection', // primaryText, secondaryText, content, buttons
	'testimonialSection', // primaryText, content, testimonials
	'contactSection', // primaryText, content
)

export class ContentBlock {
	order = def.intColumn().notNull()
	type = def.enumColumn(ContentBlockType).notNull()
	page = def.manyHasOne(Page, 'blocks').notNull().cascadeOnDelete()
	
	primaryText = def.stringColumn()
	secondaryText = def.stringColumn()
	image = def.manyHasOne(Image).setNullOnDelete()
	images = def.oneHasMany(ContentImage, 'contentBlock').orderBy('order')
	buttons = def.oneHasMany(ContentButton, 'contentBlock').orderBy('order')
	content = def.oneHasOne(Content).removeOrphan().setNullOnDelete()
	featureList = def.oneHasMany(ContentFeatureItem, 'contentBlock').orderBy('order')
	testimonials = def.oneHasMany(ContentTestimonial, 'contentBlock').orderBy('order')
	blogPosts = def.oneHasMany(ContentBlogPost, 'contentBlock').orderBy('order')
}

export class ContentImage {
	order = def.intColumn().notNull()
	image = def.manyHasOne(Image).setNullOnDelete()
	contentBlock = def.manyHasOne(ContentBlock, 'images').notNull().cascadeOnDelete()
}

export class ContentButton {
	order = def.intColumn().notNull()
	button = def.oneHasOne(Button).notNull().removeOrphan()
	contentBlock = def.manyHasOne(ContentBlock, 'buttons').notNull().cascadeOnDelete()
}

export class ContentFeatureItem {
	order = def.intColumn().notNull()
	primaryText = def.stringColumn()
	content = def.oneHasOne(Content).removeOrphan().setNullOnDelete()
	icon = def.manyHasOne(Image).setNullOnDelete()
	contentBlock = def.manyHasOne(ContentBlock, 'featureList').notNull().cascadeOnDelete()
}

export class ContentTestimonial {
	order = def.intColumn().notNull()
	content = def.oneHasOne(Content).notNull().removeOrphan()
	author = def.oneHasOne(TestimonialAuthor).removeOrphan().setNullOnDelete()
	testimonial = def.manyHasOne(Testimonial)
	contentBlock = def.manyHasOne(ContentBlock, "testimonials").cascadeOnDelete()
}

export class ContentBlogPost {
	order = def.intColumn().notNull()
	blogPost = def.manyHasOne(Article)
	contentBlock = def.manyHasOne(ContentBlock, 'blogPosts').notNull().cascadeOnDelete()
}
