import { isCodeComment, isComment, isSystemComment, parseStartingLineIfOne } from './utils'
                const startingLine =
                  parseStartingLineIfOne(codeDiffSnapshot ?? '') !== null
                    ? parseStartingLineIfOne(codeDiffSnapshot ?? '')
                    : null
                        {startingLine ? (
                          <div className="bg-[--diff-hunk-lineNumber--]">
                            <div className="w-full px-8 ml-16 py-1 font-mono ">{startingLine}</div>
                          </div>
                        ) : null}
