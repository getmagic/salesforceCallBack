public class FileViewerExtension {

    public ID recordId {get;set;}
    public list <ContentDocumentLink> files {set;get;}
    
    public FileViewerExtension(ApexPages.StandardController controller) {
        recordId = System.currentPageReference().getParameters().get('id');
        files = [SELECT Id, ContentDocumentId, ContentDocument.LatestPublishedVersionId, ContentDocument.LatestPublishedVersion.Title FROM ContentDocumentLink WHERE LinkedEntityId = 'a008c00000bVRMUAA4'];
    }
}
