import { defineArrayMember, defineField, defineType } from 'sanity'

export const schemaTypes = [
  defineType({
    name: 'resource',
    title: 'Resource',
    type: 'document',
    fields: [
      defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
      defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (rule) => rule.required() }),
      defineField({
        name: 'pillar',
        title: 'Pillar',
        type: 'string',
        options: { list: ['adhd', 'autism', 'burnout', 'workplace', 'ehcp'] },
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'type',
        title: 'Type',
        type: 'string',
        options: { list: ['tool', 'guide', 'template', 'printable'] },
        validation: (rule) => rule.required(),
      }),
      defineField({ name: 'description', title: 'Description', type: 'string' }),
      defineField({
        name: 'body',
        title: 'Body',
        type: 'array',
        of: [defineArrayMember({ type: 'block' })],
      }),
      defineField({ name: 'readTime', title: 'Read time', type: 'string' }),
      defineField({ name: 'downloadUrl', title: 'Download URL', type: 'url' }),
      defineField({
        name: 'sources',
        title: 'Sources',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            fields: [
              defineField({ name: 'title', title: 'Title', type: 'string' }),
              defineField({ name: 'url', title: 'URL', type: 'url' }),
            ],
          }),
        ],
      }),
    ],
  }),
  defineType({
    name: 'creator',
    title: 'Creator',
    type: 'document',
    fields: [
      defineField({ name: 'handle', title: 'Handle', type: 'string' }),
      defineField({ name: 'description', title: 'Description', type: 'string' }),
      defineField({ name: 'followerCount', title: 'Follower count', type: 'number' }),
      defineField({ name: 'platform', title: 'Platform', type: 'string' }),
      defineField({ name: 'avatarUrl', title: 'Avatar URL', type: 'url' }),
    ],
  }),
  defineType({
    name: 'event',
    title: 'Event',
    type: 'document',
    fields: [
      defineField({ name: 'title', title: 'Title', type: 'string' }),
      defineField({ name: 'date', title: 'Date', type: 'datetime' }),
      defineField({ name: 'time', title: 'Time', type: 'string' }),
      defineField({ name: 'location', title: 'Location', type: 'string' }),
      defineField({ name: 'joinUrl', title: 'Join URL', type: 'url' }),
    ],
  }),
  defineType({
    name: 'affiliateProduct',
    title: 'Affiliate Product',
    type: 'document',
    fields: [
      defineField({ name: 'name', title: 'Name', type: 'string' }),
      defineField({ name: 'tag', title: 'Tag', type: 'string' }),
      defineField({ name: 'icon', title: 'Icon', type: 'string' }),
      defineField({ name: 'affiliateUrl', title: 'Affiliate URL', type: 'url' }),
    ],
  }),
]
