export interface AdaptationRule {
  id: string
  name: string
  rules: string
  createdAt: string
}

export class AdaptationRulesService {
  static STORAGE_KEY = 'adaptationRules'
  static MAX_RULES = 5

  static getAdaptationRules(): AdaptationRule[] {
    const storedRules = localStorage.getItem(this.STORAGE_KEY)
    return storedRules ? JSON.parse(storedRules) : []
  }

  static saveAdaptationRule(name: string, rules: string): AdaptationRule | null {
    const existingRules = this.getAdaptationRules()

    if (existingRules.length >= this.MAX_RULES) {
      return null
    }

    const newRule: AdaptationRule = {
      id: Date.now().toString(),
      name,
      rules,
      createdAt: new Date().toISOString()
    }

    const updatedRules = [...existingRules, newRule]
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedRules))
    return newRule
  }

  static updateAdaptationRule(id: string, name: string, rules: string): AdaptationRule | null {
    const existingRules = this.getAdaptationRules()
    const ruleIndex = existingRules.findIndex(rule => rule.id === id)

    if (ruleIndex === -1) return null

    existingRules[ruleIndex] = {
      ...existingRules[ruleIndex],
      name,
      rules,
      createdAt: new Date().toISOString()
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingRules))
    return existingRules[ruleIndex]
  }

  static deleteAdaptationRule(id: string): boolean {
    const existingRules = this.getAdaptationRules()
    const filteredRules = existingRules.filter(rule => rule.id !== id)

    if (filteredRules.length === existingRules.length) return false

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredRules))
    return true
  }
}
