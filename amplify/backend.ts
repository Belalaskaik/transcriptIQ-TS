import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { commentsAndSummariesBucket, attachmentsBucket} from './storage/resource';
import { transcriptHandler } from './functions/transcriptHandler/resource';

defineBackend({
  auth,
  data,
  commentsAndSummariesBucket,
  attachmentsBucket,
  transcriptHandler
});