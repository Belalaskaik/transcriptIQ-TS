import { defineStorage } from '@aws-amplify/backend';

export const commentsAndSummariesBucket = defineStorage({
  name: 'commentsAndSummariesBucket',
  access: (allow) => ({
    'comments/{transcript_id}/{comment_id}/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read'])
    ],
    'summaries/{transcript_id}/*': [
      allow.authenticated.to(['read']),
      allow.guest.to(['read'])
    ],
  })
});

export const attachmentsBucket = defineStorage({
  name: 'attachmentsBucket',
  access: (allow) => ({
    'attachments/{transcript_id}/{comment_id}/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read'])
    ]
  })
});