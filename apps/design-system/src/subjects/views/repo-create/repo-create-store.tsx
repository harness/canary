export const useRepoCreateStore = () => {
  const gitIgnoreOptions = [
    'AL',
    'Actionscript',
    'Ada',
    'Agda',
    'Android',
    'AppEngine',
    'AppceleratorTitanium',
    'ArchLinuxPackages',
    'Autotools',
    'C++',
    'C',
    'CFWheels',
    'CMake',
    'CONTRIBUTING.md',
    'CUDA',
    'CakePHP',
    'ChefCookbook',
    'Clojure',
    'CodeIgniter',
    'CommonLisp',
    'Composer',
    'Concrete5',
    'Coq',
    'CraftCMS',
    'D',
    'DM',
    'Dart',
    'Delphi',
    'Drupal',
    'EPiServer',
    'Eagle',
    'Elisp',
    'Elixir',
    'Elm',
    'Erlang',
    'ExpressionEngine',
    'ExtJs',
    'Fancy',
    'Finale',
    'FlaxEngine',
    'ForceDotCom',
    'Fortran',
    'FuelPHP',
    'GWT',
    'Gcov',
    'GitBook',
    'Go',
    'Godot',
    'Gradle',
    'Grails',
    'Haskell',
    'IGORPro',
    'Idris',
    'JBoss',
    'JENKINS_HOME',
    'Java',
    'Jekyll',
    'Joomla',
    'Julia',
    'KiCad',
    'Kohana',
    'Kotlin',
    'LICENSE',
    'LabVIEW',
    'Laravel',
    'Leiningen',
    'LemonStand',
    'Lilypond',
    'Lithium',
    'Lua',
    'Magento',
    'Maven',
    'Mercury',
    'MetaProgrammingSystem',
    'Nanoc',
    'Nim',
    'Node',
    'OCaml',
    'Objective-C',
    'Opa',
    'OpenCart',
    'OracleForms',
    'Packer',
    'Perl',
    'Phalcon',
    'PlayFramework',
    'Plone',
    'Prestashop',
    'Processing',
    'PureScript',
    'Python',
    'Qooxdoo',
    'Qt',
    'R',
    'README.md',
    'ROS',
    'Racket',
    'Rails',
    'Raku',
    'RhodesRhomobile',
    'Ruby',
    'Rust',
    'SCons',
    'Sass',
    'Scala',
    'Scheme',
    'Scrivener',
    'Sdcc',
    'SeamGen',
    'SketchUp',
    'Smalltalk',
    'Stella',
    'SugarCRM',
    'Swift',
    'Symfony',
    'SymphonyCMS',
    'TeX',
    'Terraform',
    'Textpattern',
    'TurboGears2',
    'TwinCAT3',
    'Typo3',
    'Unity',
    'UnrealEngine',
    'VVVV',
    'VisualStudio',
    'Waf',
    'WordPress',
    'Xojo',
    'Yeoman',
    'Yii',
    'ZendFramework',
    'Zephir'
  ]

  const licenseOptions = [
    {
      label: 'None',
      value: 'none'
    },
    {
      label: 'Academic Free License v3.0',
      value: 'afl-3.0'
    },
    {
      label: 'Apache license 2.0',
      value: 'apache-2.0'
    },
    {
      label: 'Artistic license 2.0',
      value: 'artistic-2.0'
    },
    {
      label: 'Boost Software License 1.0',
      value: 'bsl-1.0'
    },
    {
      label: 'BSD 2-clause "Simplified" license',
      value: 'bsd-2-clause'
    },
    {
      label: 'BSD 3-clause "New" or "Revised" license',
      value: 'bsd-3-clause'
    },
    {
      label: 'BSD 3-clause Clear license',
      value: 'bsd-3-clause-clear'
    },
    {
      label: 'Creative Commons license family',
      value: 'cc'
    },
    {
      label: 'Creative Commons Zero v1.0 Universal',
      value: 'cc0-1.0'
    },
    {
      label: 'Creative Commons Attribution 4.0',
      value: 'cc-by-4.0'
    },
    {
      label: 'Creative Commons Attribution Share Alike 4.0',
      value: 'cc-by-sa-4.0'
    },
    {
      label: 'Educational Community License v2.0',
      value: 'ecl-2.0'
    },
    {
      label: 'Eclipse Public License 1.0',
      value: 'epl-1.0'
    },
    {
      label: 'Eclipse Public License 2.0',
      value: 'epl-2.0'
    },
    {
      label: 'European Union Public License 1.1',
      value: 'eupl-1.1'
    },
    {
      label: 'GNU Affero General Public License v3.0',
      value: 'agpl-3.0'
    },
    {
      label: 'GNU General Public License family',
      value: 'gpl'
    },
    {
      label: 'GNU General Public License v2.0',
      value: 'gpl-2.0'
    },
    {
      label: 'GNU General Public License v3.0',
      value: 'gpl-3.0'
    },
    {
      label: 'GNU Lesser General Public License family',
      value: 'lgpl'
    },
    {
      label: 'GNU Lesser General Public License v2.1',
      value: 'lgpl-2.1'
    },
    {
      label: 'GNU Lesser General Public License v3.0',
      value: 'lgpl-3.0'
    },
    {
      label: 'ISC',
      value: 'isc'
    },
    {
      label: 'MIT',
      value: 'mit'
    },
    {
      label: 'Mozilla Public License 2.0',
      value: 'mpl-2.0'
    },
    {
      label: 'Open Software License 3.0',
      value: 'osl-3.0'
    },
    {
      label: 'The Unlicense',
      value: 'unlicense'
    },
    {
      label: 'zLib License',
      value: 'zlib'
    }
  ]

  return {
    gitIgnoreOptions,
    licenseOptions
  }
}
