import { Download, FileText, ExternalLink, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Google Drive PDF embed URL - converted from share link
const GOOGLE_DRIVE_FILE_ID = "1nf-GsGo0MrRUgn_6xjvhlnmymZJFpqsA";
const PDF_EMBED_URL = `https://drive.google.com/file/d/${GOOGLE_DRIVE_FILE_ID}/preview`;
const PDF_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${GOOGLE_DRIVE_FILE_ID}`;
const PDF_VIEW_URL = `https://drive.google.com/file/d/${GOOGLE_DRIVE_FILE_ID}/view`;

export const CVWindow = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText className="w-5 h-5" />
          <span className="text-sm font-medium">Eyad_Ayman_CV.pdf</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-secondary border-border hover:bg-secondary/80"
            asChild
          >
            <a href={PDF_VIEW_URL} target="_blank" rel="noopener noreferrer">
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Fullscreen</span>
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-secondary border-border hover:bg-secondary/80"
            asChild
          >
            <a href={PDF_VIEW_URL} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Open in Drive</span>
            </a>
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-primary hover:bg-primary/90"
            asChild
          >
            <a href={PDF_DOWNLOAD_URL} download>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </a>
          </Button>
        </div>
      </div>

      {/* PDF Preview */}
      <div className="flex-1 mt-4 rounded-lg bg-secondary/30 border border-border overflow-hidden relative min-h-[300px]">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">Loading CV...</span>
            </div>
          </div>
        )}
        
        {hasError ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-32 bg-secondary/50 rounded-lg flex items-center justify-center mb-6 border border-border">
              <FileText className="w-12 h-12 text-primary/50" />
            </div>
            
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Unable to load preview
            </h3>
            <p className="text-muted-foreground text-sm max-w-md mb-6">
              The PDF preview couldn't be loaded. You can still view or download the CV using the buttons above.
            </p>

            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <a href={PDF_VIEW_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Google Drive
                </a>
              </Button>
              <Button asChild>
                <a href={PDF_DOWNLOAD_URL} download>
                  <Download className="w-4 h-4 mr-2" />
                  Download CV
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <iframe
            src={PDF_EMBED_URL}
            className="w-full h-full min-h-[500px]"
            title="CV Preview"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            allow="autoplay"
          />
        )}
      </div>
    </div>
  );
};

export default CVWindow;
