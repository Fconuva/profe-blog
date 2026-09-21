#target illustrator
/* Generador local de Estudia CEST. No conecta a internet, no borra archivos
 * y no modifica documentos abiertos. Crea un documento nuevo con 32 mesas.
 * Los datos se insertan al construir el paquete. */
(function () {
    var data = /*__TEMPLATE_DATA__*/;
    var root = new File($.fileName).parent;
    function rgb(hex) {
        var c = new RGBColor();
        c.red = parseInt(hex.substr(1,2),16);
        c.green = parseInt(hex.substr(3,2),16);
        c.blue = parseInt(hex.substr(5,2),16);
        return c;
    }
    function font(bold) {
        var names = bold ? ['Arial-BoldMT','Arial-Bold','Helvetica-Bold'] : ['ArialMT','Arial','Helvetica'];
        for (var f=0;f<names.length;f++) { try { return app.textFonts.getByName(names[f]); } catch(e) {} }
        throw new Error('Instala Arial o Helvetica antes de crear la plantilla.');
    }
    var normal, bold;
    try { normal=font(false); bold=font(true); }
    catch(e) { alert(e.message); return; }
    for (var p=0;p<data.pages.length;p++) {
        var elements=data.pages[p].nodes;
        for (var k=0;k<elements.length;k++) if(elements[k].kind==='image' && !new File(root.fsName+'/'+elements[k].src).exists) {
            alert('Extrae primero el ZIP completo. Falta: '+elements[k].src); return;
        }
    }
    var doc;
    try {
        doc=app.documents.add(DocumentColorSpace.RGB,data.width,data.height);
        var first=doc.artboards[0].artboardRect;
        var originX=first[0], originY=first[1];
        var names=['Fondos','Marcos','Imagenes','Numeracion','Titulos','Textos','Ayudas'];
        var layers={};
        doc.layers[0].name=names[0];layers[names[0]]=doc.layers[0];
        for(var l=1;l<names.length;l++){layers[names[l]]=doc.layers.add();layers[names[l]].name=names[l];}
        for(p=0;p<data.pages.length;p++) {
            var page=data.pages[p], ox=originX+(p%4)*(data.width+40), oy=originY-Math.floor(p/4)*(data.height+40);
            var ab=p===0?doc.artboards[0]:doc.artboards.add([ox,oy,ox+data.width,oy-data.height]);
            ab.name=('0'+(p+1)).slice(-2)+' '+page.title;
            var groups={};
            for(l=0;l<names.length;l++) {groups[names[l]]=layers[names[l]].groupItems.add();groups[names[l]].name=ab.name;}
            for(k=0;k<page.nodes.length;k++) {
                var n=page.nodes[k], group=groups[n.layer], item;
                if(n.kind==='rect'||n.kind==='ellipse') {
                    item=n.kind==='rect'?group.pathItems.rectangle(oy-n.y,ox+n.x,n.w,n.h):group.pathItems.ellipse(oy-n.y,ox+n.x,n.w,n.h);
                    item.filled=true;item.fillColor=rgb(n.color);item.stroked=!!n.stroke;
                    if(n.stroke){item.strokeColor=rgb(n.stroke);item.strokeWidth=1;}
                } else if(n.kind==='image') {
                    item=doc.placedItems.add();item.file=new File(root.fsName+'/'+n.src);
                    item.width=n.w;item.height=n.h;item.position=[ox+n.x,oy-n.y];
                    item.move(group,ElementPlacement.PLACEATEND);item.embed();
                } else {
                    var frame=group.pathItems.rectangle(oy-n.y,ox+n.x,n.w,n.h);
                    frame.filled=false;frame.stroked=false;
                    item=doc.textFrames.areaText(frame);
                    item.name=n.name;
                    item.contents=n.text.replace(/\n/g,'\r');
                    item.textRange.characterAttributes.textFont=n.bold?bold:normal;
                    item.textRange.characterAttributes.size=n.size;
                    item.textRange.characterAttributes.autoLeading=false;
                    item.textRange.characterAttributes.leading=n.leading;
                    item.textRange.characterAttributes.fillColor=rgb(n.color);
                    item.textRange.paragraphAttributes.hyphenation=false;
                    item.move(group,ElementPlacement.PLACEATEND);
                }
            }
        }
        layers.Fondos.locked=true;
        layers.Marcos.locked=true;
        layers.Numeracion.locked=true;
        doc.activeLayer=layers.Textos;
        doc.artboards.setActiveArtboardIndex(0);
        app.redraw();
        alert('Plantilla creada: 32 mesas A4.\n\n1. Guarda con Archivo > Guardar como > Adobe Illustrator (.ai).\n2. Edita los textos entre corchetes con la herramienta Texto (T).\n3. En Ventana > Capas puedes desbloquear fondos, cambiar imágenes y ocultar Ayudas.\n\nLas páginas a elección se pueden quitar. Revisa los marcos de texto después de escribir.');
    } catch(e) {
        alert('No se pudo completar la plantilla: '+e.message+'\nPuedes abrir Plantilla_Anuario_4D.pdf o una página de paginas-svg. Si quedó un documento parcial, ciérralo sin guardar.');
    }
}());
