
import { hovedstyret, kjellerstyret } from "./board";
import textBlock from "./pageTypeSchemas/textBlock";
import gallery from "./pageTypeSchemas/gallery";
import boardPosition from "./boardPosition";
import workGroup from "./workGroup";
import pageType from "./pageType";
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