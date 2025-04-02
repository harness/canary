import { siBitbucket, siGithub, siGitlab, siJira, siKubernetes, type SimpleIcon } from 'simple-icons'

const LogoSet = [siBitbucket, siGithub, siGitlab, siJira, siKubernetes]

/**
 * Generates a map of logo names to their corresponding `SimpleIcon` data.
 *
 * @returns {Map<string, SimpleIcon>} A map where the keys are logo slugs (e.g., `"github"`)
 * and the values are `SimpleIcon` objects containing path data and brand color.
 *
 * @example
 * ```ts
 * const logoMap = getLogoNameMap();
 * const githubIcon = logoMap.get("github");
 * console.log(githubIcon?.path); // SVG path data
 * ```
 */
export const getLogoNameMap = (): Map<string, SimpleIcon> =>
  LogoSet.reduce((acc, icon) => {
    acc.set(icon.slug, icon)
    return acc
  }, new Map<string, SimpleIcon>())
