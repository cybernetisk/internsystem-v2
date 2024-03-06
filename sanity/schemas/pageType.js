
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({
      name: 'pageBuilder',
      type: 'array',
      title: 'Page builder',
      of: [
        defineArrayMember({
          name: 'textblock',
          type: 'textblock',
        }),
        // defineArrayMember({
        //   name: 'textWithIllustration',
        //   type: 'textWithIllustration',
        // }),
        defineArrayMember({
          name: 'gallery',
          type: 'gallery',
        }),
        // defineArrayMember({
        //   name: 'form',
        //   type: 'form',
        // }),
        // defineArrayMember({
        //   name: 'video',
        //   type: 'video',
        // }),
        // defineArrayMember({
        //   name: 'callToAction',
        //   type: 'reference',
        //   to: [{type: 'promotion'}],
        // }),
      ],
    }),
  ],
})