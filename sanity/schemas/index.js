
import { hovedstyret, kjellerstyret } from "./board";
import textBlock from "./pageTypeSchemas/textBlock";
import pageType from "./pageTypeSchemas/pageType";
import gallery from "./pageTypeSchemas/gallery";
import boardPosition from "./boardPosition";
import workGroup from "./workGroup";
import event from "./event";

export const schemaTypes = [
  hovedstyret,
  kjellerstyret,
  boardPosition,
  workGroup,
  event,
  textBlock,
  pageType,
  gallery,
]