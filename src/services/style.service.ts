export interface SavedStyle {
  name: string
  content: string
  tov?: string
  isDefault?: boolean
  createdAt: string
}

export class StyleService {
  static getSavedStyles(): SavedStyle[] {
    const storedStyles = localStorage.getItem('savedStyles')
    return storedStyles ? JSON.parse(storedStyles) : []
  }

  static saveStyle(
    styleName: string, 
    styleContent: string, 
    tov?: string
  ) {
    const newStyle: SavedStyle = {
      name: styleName,
      content: styleContent,
      tov: tov,
      createdAt: new Date().toISOString()
    }

    const savedStyles = this.getSavedStyles()
    
    // Check if this is the first style, if so, set as default
    if (savedStyles.length === 0) {
      newStyle.isDefault = true
    }

    savedStyles.push(newStyle)
    localStorage.setItem('savedStyles', JSON.stringify(savedStyles))
  }

  static updateStyle(
    oldStyleName: string,
    newStyleName: string, 
    styleContent: string, 
    tov?: string
  ) {
    const savedStyles = this.getSavedStyles()
    
    const updatedStyles = savedStyles.map(style => {
      if (style.name === oldStyleName) {
        return {
          ...style,
          name: newStyleName,
          content: styleContent,
          tov: tov,
          createdAt: new Date().toISOString()
        }
      }
      return style
    })

    localStorage.setItem('savedStyles', JSON.stringify(updatedStyles))
  }

  static setDefaultStyle(styleName: string) {
    const savedStyles = this.getSavedStyles()
    
    // Remove previous default flag and set new default
    const updatedStyles = savedStyles.map(style => ({
      ...style,
      isDefault: style.name === styleName
    }))

    localStorage.setItem('savedStyles', JSON.stringify(updatedStyles))
  }

  static getDefaultStyle(): SavedStyle | null {
    const savedStyles = this.getSavedStyles()
    
    // First, try to find an explicitly set default style
    const explicitDefault = savedStyles.find(style => style.isDefault)
    
    // If no explicit default, return the last style
    return explicitDefault || 
           (savedStyles.length > 0 ? savedStyles[savedStyles.length - 1] : null)
  }

  static deleteStyle(styleName: string) {
    const savedStyles = this.getSavedStyles()
    const updatedStyles = savedStyles.filter(style => style.name !== styleName)

    // If we deleted the default style, set a new default
    const wasDefaultStyle = savedStyles.find(s => s.name === styleName)?.isDefault
    if (wasDefaultStyle && updatedStyles.length > 0) {
      // Set the last style as default
      updatedStyles[updatedStyles.length - 1].isDefault = true
    }

    // Update localStorage
    localStorage.setItem('savedStyles', JSON.stringify(updatedStyles))
  }

  static ensureDefaultStyle() {
    const savedStyles = this.getSavedStyles()
    
    // If no styles exist, do nothing
    if (savedStyles.length === 0) return

    // If no default style is set, set the last style as default
    if (!savedStyles.some(style => style.isDefault)) {
      savedStyles[savedStyles.length - 1].isDefault = true
      localStorage.setItem('savedStyles', JSON.stringify(savedStyles))
    }
  }
}
