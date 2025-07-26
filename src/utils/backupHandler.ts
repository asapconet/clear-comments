import * as fs from "fs";
import * as path from "path";

export interface BackupResult {
  success: boolean;
  backupPath?: string;
  error?: string;
}

/**
 * Create backup of a file before processing
 */
export function createFileBackup(
  filePath: string,
  backupDir: string
): BackupResult {
  try {
    // Ensure backup directory exists
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Create backup file path maintaining directory structure
    const relativePath = path.relative(process.cwd(), filePath);
    const backupPath = path.join(backupDir, relativePath);
    const backupDirPath = path.dirname(backupPath);

    // Create backup subdirectories if needed
    if (!fs.existsSync(backupDirPath)) {
      fs.mkdirSync(backupDirPath, { recursive: true });
    }

    // Copy original file to backup location
    fs.copyFileSync(filePath, backupPath);

    return {
      success: true,
      backupPath,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Create backup manifest file
 */
export function createBackupManifest(backupDir: string, files: string[]): void {
  const manifest = {
    timestamp: new Date().toISOString(),
    totalFiles: files.length,
    files: files.map((f) => path.relative(process.cwd(), f)),
  };

  const manifestPath = path.join(backupDir, "backup-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

/**
 * Restore files from backup
 */
export function restoreFromBackup(backupDir: string): {
  restored: number;
  errors: string[];
} {
  const manifestPath = path.join(backupDir, "backup-manifest.json");

  if (!fs.existsSync(manifestPath)) {
    throw new Error("No backup manifest found");
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  let restored = 0;
  const errors: string[] = [];

  for (const relativeFilePath of manifest.files) {
    try {
      const originalPath = path.resolve(relativeFilePath);
      const backupPath = path.join(backupDir, relativeFilePath);

      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, originalPath);
        restored++;
      } else {
        errors.push(`Backup not found for: ${relativeFilePath}`);
      }
    } catch (error) {
      errors.push(`Failed to restore ${relativeFilePath}: ${error}`);
    }
  }

  return { restored, errors };
}
