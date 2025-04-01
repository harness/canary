---
title: Logos
---

The `Logo` component renders brand icons from the `simple-icons` package.

````md
## Example

```jsx
<Logo name="github" size={40} />
```
````

## Original Brand Color

By default, the `Logo` component inherits the text color using `currentColor`. Use the `original` prop to render the logo in its official brand color.

```jsx
<Logo name="gitlab" size={48} original />
```

## Size

Customize the size using the `size` prop.

```jsx
<Logo name="gitlab" size={48} />
```

## Available Icons

| Icon                                                     | Name        |
| -------------------------------------------------------- | ----------- |
| ![GitHub Logo](https://cdn.simpleicons.org/github)       | `github`    |
| ![GitLab Logo](https://cdn.simpleicons.org/gitlab)       | `gitlab`    |
| ![Bitbucket Logo](https://cdn.simpleicons.org/bitbucket) | `bitbucket` |
| ![Git Logo](https://cdn.simpleicons.org/git)             | `git`       |
