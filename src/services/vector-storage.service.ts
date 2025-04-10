import { openai } from '../config/openai'

export interface VectorStorageFile {
  name: string
  content: string
}

export interface ProfileData {
  name: string
  content: string
  vectorStoreId: string
  createdAt: string
  isDefault?: boolean
}

export class VectorStorageService {
  static async createVectorStore(
    files: File[], 
    profileText: string
  ): Promise<string | null> {
    try {
      // Convert files to text content
      const fileContents: VectorStorageFile[] = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          content: await this.readFileAsText(file)
        }))
      )

      // Add profile text as a file if it exists
      if (profileText.trim()) {
        fileContents.push({
          name: 'profile_description.txt',
          content: profileText
        })
      }

      // Create vector store
      const vectorStore = await openai.vectorStores.create({
        name: `Profile Vector Store - ${new Date().toISOString()}`
      })

      // Upload files to vector store
      const fileStreams = fileContents.map(file => 
        new File([file.content], file.name)
      )
      await openai.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, {files: fileStreams})
      
      return vectorStore.id
    } catch (error) {
      console.error('Error creating vector store:', error)
      return null
    }
  }

  private static async readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = (e) => reject(e)
      reader.readAsText(file)
    })
  }

  static saveProfileData(
    profileName: string, 
    profileContent: string, 
    vectorStoreId: string
  ) {
    const profileData: ProfileData = {
      name: profileName,
      content: profileContent,
      vectorStoreId: vectorStoreId,
      createdAt: new Date().toISOString()
    }

    const savedProfiles = this.getSavedProfiles()
    savedProfiles.push(profileData)
    localStorage.setItem('savedProfiles', JSON.stringify(savedProfiles))
  }

  static getSavedProfiles(): ProfileData[] {
    const storedProfiles = localStorage.getItem('savedProfiles')
    return storedProfiles ? JSON.parse(storedProfiles) : []
  }

  static setDefaultProfile(profileName: string) {
    const savedProfiles = this.getSavedProfiles()
    
    // Remove previous default flag
    const updatedProfiles = savedProfiles.map(profile => ({
      ...profile,
      isDefault: profile.name === profileName
    }))

    localStorage.setItem('savedProfiles', JSON.stringify(updatedProfiles))
  }

  static getDefaultProfile(): ProfileData | null {
    const savedProfiles = this.getSavedProfiles()
    return savedProfiles.find(profile => profile.isDefault) || 
           (savedProfiles.length > 0 ? savedProfiles[savedProfiles.length - 1] : null)
  }

  static getCurrentVectorStoreId(): string | null {
    const defaultProfile = this.getDefaultProfile()
    return defaultProfile ? defaultProfile.vectorStoreId : null
  }

  static deleteProfile(profileName: string) {
    const savedProfiles = this.getSavedProfiles()
    const updatedProfiles = savedProfiles.filter(profile => profile.name !== profileName)

    // If we deleted the default profile, set a new default
    const wasDefaultProfile = savedProfiles.find(p => p.name === profileName)?.isDefault
    if (wasDefaultProfile && updatedProfiles.length > 0) {
      // Set the last profile as default
      updatedProfiles[updatedProfiles.length - 1].isDefault = true
    }

    // Delete vector store if it exists
    const profileToDelete = savedProfiles.find(p => p.name === profileName)
    if (profileToDelete && profileToDelete.vectorStoreId) {
      this.deleteVectorStore(profileToDelete.vectorStoreId)
    }

    // Update localStorage
    localStorage.setItem('savedProfiles', JSON.stringify(updatedProfiles))
  }

  private static async deleteVectorStore(vectorStoreId: string) {
    try {
      await openai.vectorStores.del(vectorStoreId)
      console.log(`Vector store ${vectorStoreId} deleted successfully`)
    } catch (error) {
      console.error('Error deleting vector store:', error)
    }
  }

  static ensureDefaultProfile() {
    const savedProfiles = this.getSavedProfiles()
    
    // If no profiles exist, do nothing
    if (savedProfiles.length === 0) return

    // If no default profile is set, set the last profile as default
    if (!savedProfiles.some(profile => profile.isDefault)) {
      savedProfiles[savedProfiles.length - 1].isDefault = true
      localStorage.setItem('savedProfiles', JSON.stringify(savedProfiles))
    }
  }
}
